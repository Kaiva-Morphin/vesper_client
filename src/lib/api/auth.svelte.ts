import { PUBLIC_API_BASE } from "$env/static/public";
import { setAccess } from "$lib/token.svelte";
import { DEVICE_FINGERPRINT } from "./fingerprint.svelte";


export const STATE_TOKEN_KEY = "state_token";



export async function requestRegisterCode(turnstile: string, email: string) : Promise<boolean> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/account/request_register_code`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                turnstile_token: turnstile,
                email: email
            })
        });
        return res.ok;
    } catch {}
    return false;
}

export function determineRegisterError(error: string) : 
    'EMAIL_EXISTS' | 'USERNAME_EXISTS' | 'TOS' |
    'INVALID_EMAIL' | 'INVALID_EMAIL_CODE' |  'INVALID_PASSWORD' | 'INVALID_USERNAME' | string {
    let e : string = error.toLocaleLowerCase();
    if (e.includes("invalid")) {
        if (e.includes("email code")) {return 'INVALID_EMAIL_CODE'}
        if (e.includes("email")) {return 'INVALID_EMAIL'}
        if (e.includes("password")) {return 'INVALID_PASSWORD'}
        if (e.includes("uid")) {return 'INVALID_USERNAME'}
        if (e.includes("nickname")) {return 'INVALID_USERNAME'}
    } else {
        if (e.includes("tos")) {return 'TOS'}
        if (e.includes("uid")) {return 'USERNAME_EXISTS'}
        if (e.includes("email")) {return 'EMAIL_EXISTS'}
    }
    return error
}

export async function register(turnstile: string, uid: string, password: string, nickname: string, email: string, email_code: string, ) : Promise<{access_token: string, exp: number} | string> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/account`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "uid": uid,
                "nickname": nickname,
                "password": password,
                "fingerprint": DEVICE_FINGERPRINT, // TODO!
                "email": email,
                "email_code": email_code,
                "tos_accepted": true,
                "turnstile_token": turnstile
            })
        });
        
        if (!res.ok) return await res.text();
        let j = await res.json();
        return j
    } catch (e: any) {
        return "Something went wrong!";
    }
}

export async function oauth_register(turnstile: string, temp_token: string, uid: string, password: string ) : Promise<{access_token: string, exp: number} | string> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/oauth/account`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "uid": uid,
                "password": password,
                "fingerprint": DEVICE_FINGERPRINT, // TODO!
                "tos_accepted": true,
                "turnstile_token": turnstile,
                "temp_token": temp_token
            })
        });
        
        if (!res.ok) return await res.text();
        let j = await res.json();
        return j
    } catch (e: any) {
        return "Something went wrong!";
    }
}

export async function login(turnstile: string, email: string, password: string ) : Promise<{access_token: string, exp: number} | string> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/session`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "email": email,
                "password": password,
                // "fingerprint": DEVICE_FINGERPRINT, // TODO!
                "turnstile_token": turnstile
            })
        });
        
        if (!res.ok) return await res.text();
        let j = await res.json();
        return j
    } catch (e: any) {
        return "Something went wrong!";
    }
}


export async function oauth_login(token: string ) : Promise<{access_token: string, exp: number} | string> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/oauth/session`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "token": token,
            })
        });
        
        if (!res.ok) return await res.text();
        let j = await res.json();
        return j
    } catch (e: any) {
        return "Something went wrong!";
    }
}


export async function checkUid(uid: string): Promise<boolean | null> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/account/uid_check?user_uid=${uid.toLocaleLowerCase()}`);
        if (!res.ok) return null;
        let j = await res.json();
        return j;
    } catch {}
    return null;
}

export async function refresh() : Promise<boolean> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/auth/tokens/refresh`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "fingerprint": DEVICE_FINGERPRINT,
            })
        });
        let j = await res.json();
        if (!res.ok) {console.error("CAN'T REFRESH TOKENS: ", j); return false;}
        setAccess(j);
        return true;
    } catch {}
    return false;
}

export function clearRefresh() {
    setAccess(null);
}

