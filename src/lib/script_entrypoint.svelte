<script lang="ts">
import { onMount } from "svelte";
import { init } from "./theme.svelte";
import "$lib/api/base.svelte";
import "$lib/turnstile.ts";
import { clearRefresh, refresh } from "./api/auth.svelte";

// import { TURNSTILE_SITE_KEY } from "$env/static/public";

onMount(() => {
	const style = getComputedStyle(document.documentElement);
	init(style);
	console.debug("[SYSTEM] Initial styles applied");
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
