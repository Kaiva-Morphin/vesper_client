<script lang="ts">
import { onMount } from "svelte";
import "$lib/api/base.svelte";
import "$lib/turnstile.ts";
import { clearRefresh, refresh, STATE_TOKEN_KEY } from "./api/auth.svelte";
import { CURRENT_THEME_KEY, init } from "./theme/app.svelte";
import { afterNavigate } from "$app/navigation";
import { page } from "$app/state";
import { latest_page, page_not_found } from "./path_watcher.svelte";
import { get } from "svelte/store";

// import { TURNSTILE_SITE_KEY } from "$env/static/public";
onMount(() => {
	console.debug("[SYSTEM] Initial styles applied");
	let theme = localStorage.getItem(CURRENT_THEME_KEY);
	init(theme)
});


localStorage.removeItem(STATE_TOKEN_KEY);

afterNavigate(({ to }) => {
    if (page.status == 200 && !get(page_not_found)) {
        latest_page.set(page.url.pathname);
    }
});


// window.onloadTurnstileCallback = function () {
//   turnstile.render("#example-container", {
//     sitekey: TURNSTILE_SITE_KEY,
//     callback: function (token) {
//       console.log(`Challenge Success ${token}`);
//     },
//   });
// };

// import { writable, type Writable } from 'svelte/store';
// const apiToken : Writable<null | string> = writable(null);

// export const userState = $state({
// 	name: 'name',
// });

</script>
