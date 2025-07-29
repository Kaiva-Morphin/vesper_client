<script>
  import { renderTurnstile } from "$lib/turnstile";
    import { onMount } from "svelte";
    let { callback = (() => {}) } = $props();
    onMount(() => {
        renderTurnstile("#cf-turnstile", callback)
    })
</script>

<div class="turnstile-skeleton">
    <div id="cf-turnstile" class="z-10"></div>
</div>

<style>



.turnstile-skeleton {
    position: relative;
    z-index: 0;
    width: 300px;
    height: 65px;
    overflow: hidden;
}

.turnstile-skeleton::before {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    display: block;
    background: linear-gradient(
        120deg,
        transparent 0%,
        transparent 10%,
        color-mix(in srgb, var(--color-primary) 20%, #0000) 40%,
        color-mix(in srgb, var(--color-secondary) 20%, #0000) 60%,
        transparent 90%,
        transparent 100%
    );
    animation: shimmer 1.2s infinite;
    transform: translateX(-100%);
}


@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>