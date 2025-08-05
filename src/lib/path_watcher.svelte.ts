import { localState } from "$lib/util.svelte";
import { afterNavigate } from '$app/navigation';
import { get, writable } from "svelte/store";
import { page } from "$app/state";

export const latest_page = localState("last_successful_route", "/");
export const page_not_found = writable(false);
