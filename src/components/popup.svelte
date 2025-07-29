
<!-- svelte-ignore a11y_missing_attribute -->
<script lang="ts">
  import { easeOutQuint } from '$lib/util.svelte';

import { fade, fly, scale } from 'svelte/transition';
let {on_deny} : {on_deny: (() => void)} = $props();


$effect(() => {
    const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") on_deny();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
});
    
</script>

<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<a in:fade={{duration: 100}} out:fade={{duration: 300}} tabindex="-1" class="fixed top-0 w-screen h-screen bg flex justify-center items-center p-y-12 p-x-2 z-100" onclick={on_deny}>
    <button in:fly={{ y: 100, duration: 250, easing: easeOutQuint }} out:scale={{duration: 300, easing: easeOutQuint, start: 0.5}} tabindex="-1" class="card-100 w-fit h-fit max-w-full max-h-full flex flex-col flex-wrap overflow-y-scroll no-scrollbar z-110 gap-2" onclick={(e)=>{e.stopPropagation()}}>
        <slot/>
    </button>
</a>

<style>
    .bg {
        background-color: #0005;
        cursor: default;
    }
</style>