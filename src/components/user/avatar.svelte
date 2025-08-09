<script lang="ts">
    let { 
        url, 
        class : extra_class = "",
        mini=false,
        onclick = () => {},
    } : {
        url: { path?: string | null; nickname?: string },
        class?: String,
        mini?: boolean,
        onclick?: (e: MouseEvent) => void
    } = $props();
    // Get identifier (either path or nickname)
    let identifier = url.path ?? url.nickname ?? "";

    function hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }
    let hue = url.nickname ? hashString(url.nickname) % 360 : 0;

    let firstLetter = url.nickname?.[0]?.toUpperCase() ?? "?";
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="{extra_class}" onclick={onclick}>
    {#if url.path}
        <img class="mini-bg pointer-events-none" src={url.path} alt="" onerror={(em: any) => {em.currentTarget.src="/placeholder.jpg"}}>
    {:else}
        <div class="fallback-avatar" style="--hue: {hue}; font-size: {mini ? "16px" : "32px"}">
            {firstLetter}
        </div>
    {/if}
</div>

<style>
    .fallback-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        /* font-size: x-large; */
        background-color: hsl(var(--hue), 70%, 50%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
</style>