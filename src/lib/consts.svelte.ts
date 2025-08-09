import type { Writable } from "svelte/store";
import { isDesktop } from "./platform.svelte";
import { localState } from "./util.svelte";
export const TITLEBAR_SIZE = isDesktop() ? 24 : 0;
export const media_limit = 0.25;
export type MEDIA_RULE_TYPE = "none" | "catbox"; 
export const MEDIA_RULE : Writable<MEDIA_RULE_TYPE> = localState("media_rule_setting", "none");