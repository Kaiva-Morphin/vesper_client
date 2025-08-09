import { derived, get, writable, type Readable, type Writable } from "svelte/store";
import { isDesktop } from "./platform.svelte";
import { localState } from "./util.svelte";
import type { Vec2 } from "./window/floating.svelte";
import { get_miniprofile, type MiniProfile } from "./api/profile.svelte";
import { USER_GUID } from "./token.svelte";
import { miniprofileThemeToStyle, serializeMiniprofileTheme, type MiniprofileTheme } from "./theme/miniprofile.svelte";
export const TITLEBAR_SIZE = isDesktop() ? 24 : 0;
export const media_limit = 0.25;
export type MEDIA_RULE_TYPE = "none" | "catbox"; 
export const MEDIA_RULE : Writable<MEDIA_RULE_TYPE> = localState("media_rule_setting", "none");
export const MOUSE_POS : Writable<Vec2> = writable({x: 0, y: 0});

export type UserCache = {
    miniprofile: MiniProfile | null,
}

const ALL_USER_PROFILE_CACHE : Writable<Record<string, UserCache>> = writable({});
const USER_PROFILE_CACHE : Record<string, Readable<UserCache>> = {};

export function get_profile_cache(guid: string) : Readable<UserCache | null> {
    if (!USER_PROFILE_CACHE[guid]) {
        USER_PROFILE_CACHE[guid] = derived(ALL_USER_PROFILE_CACHE, (profile_cache) => {
            return profile_cache[guid] ?? null;
        });
    }
    return USER_PROFILE_CACHE[guid];
}

export async function refresh_user_miniprofile_cache(guid: string){
    let v : MiniProfile | null = await get_miniprofile(guid);
    let t = v?.encoded_theme ?? "";
    ALL_USER_PROFILE_CACHE.update(profile_cache => ({
        ...profile_cache,
        [guid]: { miniprofile: v, miniprofile_style: t }
    }));
}
