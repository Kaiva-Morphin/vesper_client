<script lang="ts">
  import Icon from "@iconify/svelte";
    import { getCurrentWindow } from '@tauri-apps/api/window';
    const appWindow = getCurrentWindow();
    function unfocus(e : any) {
        try {e.target?.blur();} catch {}
    }
</script>

<div class="titlebar">
    <div  data-tauri-drag-region class="controls w-full h-[24px] bg-[#0002] flex flex-row items-center justify-end">
        <button class="no-focus unselectable" tabindex="-1" id="titlebar-minimize" on:click={(e) => {unfocus(e); appWindow.minimize()}}> 
            <Icon icon="fluent:minimize-16-filled" height="16px"></Icon>
        </button>
        <button class="no-focus unselectable" tabindex="-1" id="titlebar-maximize" on:click={(e) => {unfocus(e); appWindow.toggleMaximize()}}>
            <Icon icon="fluent:maximize-16-filled" height="16px"></Icon>
        </button>
        <button class="no-focus unselectable" tabindex="-1" id="titlebar-close" on:click={(e) => {unfocus(e); appWindow.close()}}>
            <!-- https://icon-sets.iconify.design/fluent/dismiss-16-filled/ -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m2.397 2.554l.073-.084a.75.75 0 0 1 .976-.073l.084.073L8 6.939l4.47-4.47a.75.75 0 1 1 1.06 1.061L9.061 8l4.47 4.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L8 9.061l-4.47 4.47a.75.75 0 0 1-1.06-1.061L6.939 8l-4.47-4.47a.75.75 0 0 1-.072-.976l.073-.084z" stroke-width="0.1" stroke="currentColor"/></svg>
        </button>
    </div>
</div>
<style>
:global{
    :root {
        --titlebar-size: 24px;
    }
}
.titlebar {
    height: var(--titlebar-size);
    z-index: 1000;
    user-select: none;
    display: grid;
    grid-template-columns: auto max-content;
    top: 0;
    left: 0;
    right: 0;
    /* background: #080808FF; */
    background-image: var(--bg-200);
    backdrop-filter: blur(4px);
    /* box-shadow: inset 0px 3px 6px color-mix(in srgb, var(--color-secondary) 40%, #0000); */
    /* box-shadow: inset 0px 1px 4px 3px color-mix(in srgb, var(--color-secondary) 60%, #000); */
}

.titlebar > .controls {
    display: flex;
}

.titlebar button {
    width: 30px;
    height: var(--titlebar-size);
    appearance: none;
    padding: 0;
    margin: 0;
    border: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
}
.titlebar button:hover {
    background: #AAA2;
    color: #FFF;
}
.titlebar #titlebar-close:hover {
    background: var(--color-error);
}

</style>