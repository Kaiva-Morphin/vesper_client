<script lang="ts">
	import { page } from '$app/state';
  	let hideRootLayout = page.url.pathname.startsWith('/oauth')
		|| page.url.pathname.startsWith('/0playground');

  	import "../app.css";
	import "../global.css";
	
	let { children } = $props();

	import { onNavigate } from '$app/navigation';
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (location.pathname === navigation.from?.url?.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				// await navigation.complete;
			});
		});
	});
	import ResizableNavbar from "../components/navbar/resizable_navbar.svelte";
	import BackgroundShaderNoise from "../components/bg/noise.svelte";
	import DesktopTitlebar from "../components/platform/desktop/titlebar.svelte";
  	import Debug from "$lib/debug.svelte";
  	import { isDesktop } from "$lib/platform.svelte";
  	import ScriptEntrypoint from "$lib/script_entrypoint.svelte";
	import ToastContainer from "../components/toast/toast_container.svelte";
  	import LoadingScreen from "../components/loading_screen.svelte";
</script>
{#if hideRootLayout}
{@render children()}
{:else}
<ScriptEntrypoint/>
<Debug/>
<!-- <BackgroundShaderNoise/> -->
<LoadingScreen/>
<ToastContainer />
<div id="main_container" class="flex flex-col h-screen w-screen">
	{#if isDesktop()}
		<DesktopTitlebar/>
	{/if}
	<ResizableNavbar>
		{@render children()}
	</ResizableNavbar>
</div>
{/if}
