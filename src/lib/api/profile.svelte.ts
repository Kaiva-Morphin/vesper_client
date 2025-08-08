




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