<script lang="ts">
import { onMount } from "svelte";
  import { init } from "./theme.svelte";

onMount(() => {
	const style = getComputedStyle(document.documentElement);
	init(style);
	console.log("INITED");
});

// import { writable, type Writable } from 'svelte/store';
// const apiToken : Writable<null | string> = writable(null);

// export const userState = $state({
// 	name: 'name',
// });
</script>