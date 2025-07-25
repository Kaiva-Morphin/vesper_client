<script lang="ts">
	import { onMount } from 'svelte';
    import "../../../titlebar.css";
    import { isDesktop } from '$lib/platform.svelte';
    import { getCurrentWindow } from '@tauri-apps/api/window';

    const appWindow = getCurrentWindow();

	let showTitlebar = false;
	onMount(() => {
		showTitlebar = isDesktop();
	});
</script>

{#if showTitlebar}
    <div class="titlebar">
        <div  data-tauri-drag-region class="controls w-full h-[32px] bg-[#000A] flex flex-row items-center justify-end gap-2">
            <button id="titlebar-minimize" title="minimize" class="hover:bg-gray-500" on:click={() => appWindow.minimize()}>
            <!-- https://api.iconify.design/mdi:window-minimize.svg -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13H5v-2h14z" />
            </svg>
            </button>
            <button id="titlebar-maximize" title="maximize" class="hover:bg-gray-500" on:click={() => appWindow.toggleMaximize()}>
            <!-- https://api.iconify.design/mdi:window-maximize.svg -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
            </svg>
            </button>
            <button id="titlebar-close" title="close" class="hover:bg-red-500" on:click={() => appWindow.close()}>
            <!-- https://api.iconify.design/mdi:close.svg -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                fill="currentColor"
                d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z"
                />
            </svg>
            </button>
        </div>
	</div>
{/if}
