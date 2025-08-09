




// #[derive(Deserialize, Serialize, Clone)]
// pub struct Profile {
//     pub uid: String,
//     pub nickname: String,
//     pub encoded_theme: Option<String>,
//     pub background: Option<String>,
//     pub status: Option<String>,
//     pub avatar: Option<String>,
// }

import { PUBLIC_API_BASE } from "$env/static/public";
import { media_limit, MEDIA_RULE } from "$lib/consts.svelte";
import { ACCESS_TOKEN } from "$lib/token.svelte";
import { get } from "svelte/store";

// #[derive(Deserialize, Serialize, Clone)]
// pub struct MiniProfile {
//     pub uid: String,
//     pub nickname: String,
//     pub encoded_theme: Option<String>,
//     pub background: Option<String>,
//     pub status: Option<String>,
//     pub avatar: Option<String>,
// }

export type Profile = {
    uid: string,
    nickname: string,
    encoded_theme: string | null,
    background: string | null,
    status: string | null,
    avatar: string | null
}
export type MiniProfile = {
    uid: string,
    nickname: string,
    encoded_theme: string | null,
    background: string | null,
    status: string | null,
    avatar: string | null
}



export async function get_profile(id: String) : Promise<Profile | null> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/user/profile/${id}`);
        if (!res.ok) return null;
        let j = await res.json();
        return j;
    } catch {
        return null;
    }
}

export async function get_miniprofile(id: String) : Promise<MiniProfile | null> {
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/user/miniprofile/${id}`);
        if (!res.ok) return null;
        let j = await res.json();
        return j;
    } catch {
        return null;
    }
}
// "/api/user/edit" : (AuthAccessLayer::only_authorized()) => {
//     put "/profile/bg" -> set_profile_background ("user.profile.edit.{from_access}.bg")
//     put "/profile/bg_url" -> set_profile_background_url ("user.profile.edit.{from_access}.bg")
//     put "/profile/theme" -> set_profile_theme ("user.profile.edit.{from_access}.theme")

//     put "/avatar" -> set_avatar ("user.profile.edit.{from_access}.avatar")
//     put "/avatar_url" -> set_avatar_url ("user.profile.edit.{from_access}.avatar")
//     put "/nickname" -> set_nickname ("user.profile.edit.{from_access}.nickname")

//     put "/miniprofile/bg" -> set_miniprofile_background ("user.miniprofile.edit.{from_access}.bg")
//     put "/miniprofile/bg_url" -> set_miniprofile_background_url ("user.miniprofile.edit.{from_access}.bg")
//     put "/miniprofile/theme" -> set_miniprofile_theme ("user.miniprofile.edit.{from_access}.theme")
// }
// "/api/user" : (AuthAccessLayer::allow_guests()) => {
//     get "/profile/{guid}" -> get_profile ("user.profile.view.{guid}")
//     get "/miniprofile/{guid}" -> get_miniprofile 
// }
export async function set_nickname(nickname: String) : Promise<boolean> {
    let access = get(ACCESS_TOKEN);
    if (!access) return false
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/user/edit/nickname`, {
            headers: {
                "Authorization": "Bearer " + access,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: `"${nickname}"`,
        });
        if (res.ok) return true
        return false
    } catch {}
    return false
}
export async function set_miniprofile_theme(encoded: String) : Promise<boolean> {
    let access = get(ACCESS_TOKEN);
    if (!access) return false
    try {
        const res = await fetch(`${PUBLIC_API_BASE}/api/user/edit/miniprofile/theme`, {
            headers: {
                "Authorization": "Bearer " + access,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: `"${encoded}"`,
        });
        if (res.ok) return true
        return false
    } catch {}
    return false
}

export async function wrapped_send_media(file: File, endpoint: string, url_endpoint: string) : Promise<string | null> {
    let access = get(ACCESS_TOKEN);
    if (!access) return "No access token"

    switch (get(MEDIA_RULE)) {
        case "none":
            if (file.size * 1024  * 1024 > media_limit) {
                return "File too large";
            }
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await fetch(`${PUBLIC_API_BASE}${endpoint}`, {
                    headers: {
                        "Authorization": "Bearer " + access,
                    },
                    method: "PUT",
                    body: formData,
                });
                if (res.ok) return null
                return await res.text()
            } catch {}
            return "Something went wrong";
        case "catbox":
            let u = await uploadToCatbox(file);
            if (u.err) return u.err;
            let r = await fetch(`${PUBLIC_API_BASE}${url_endpoint}`, {
                headers: {
                    "Authorization": "Bearer " + access,
                    "Content-Type": "application/json"
                },
                method: "PUT",
                body: `"${u.url}"`,
            })
            if (r.ok) return null
            return await r.text()
    }
}

export async function set_avatar(file: File) : Promise<string | null> {
    return await wrapped_send_media(file, "/api/user/edit/avatar", "/api/user/edit/avatar_url")
}

export async function set_miniprofile_bg(file: File) : Promise<string | null> {
    return await wrapped_send_media(file, "/api/user/edit/miniprofile/bg", "/api/user/edit/miniprofile/bg_url")
}



export async function uploadToCatbox(file: File) : Promise<{err?: string, url?: string}> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reqtype", "fileupload");
    // formData.append("userhash", "YOUR_USER_HASH_HERE"); 
    formData.append("fileToUpload", file);
    try {
        const response = await fetch("/api/catbox", {
            method: "POST",
            body: formData
        });
        if (!response.ok) return {err: "Upload failed"};
        const url = await response.text();
        console.log("File uploaded to:", url);
        return {url: url};
    } catch (err) {
        console.error(err);
    }
    return {err: "Error uploading file}"}
}