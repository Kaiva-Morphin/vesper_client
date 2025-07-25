<script lang="ts"> //  
	// import { slide } from 'svelte/transition';

	import "$lib/titlebar.svelte";

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

	import Navbar from "../components/navbar/navbar.svelte";
	import NavbarItem from "../components/navbar/item.svelte";
	import BackgroundShaderNoise from "../components/bg/noise.svelte";
  	import OnInit from "$lib/on_init.svelte";
  	import HorizontalSeparator from "../components/content/separator.svelte";
	import WindowsTitlebar from "../components/platform/windows/titlebar.svelte";
  	import Debug from "$lib/debug.svelte";
</script>


<OnInit/>
<Debug/>
<BackgroundShaderNoise/>


<!-- <div class="w-full h-full fixed top-0 bg-black -z-30"></div> -->
<!-- <WindowsTitlebar/> -->

<div id="main_container" class="absolute flex flex-nowrap w-screen h-full justify-center overflow-y-scroll antialiased -z-20 no-scrollbar">
	<Navbar>
		<NavbarItem link="/" icon="mingcute:home-4-line">Home</NavbarItem>
		<NavbarItem link="/u" icon="mingcute:user-search-line">Users</NavbarItem>
		<NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
		<NavbarItem link="/social" icon="mingcute:group-3-line">Social</NavbarItem>
		<HorizontalSeparator gradient/>
		<div class="flex-grow"></div>
		<NavbarItem link="/scroll" icon="mingcute:mouse-line">Scroll test</NavbarItem>
		<HorizontalSeparator gradient/>
		<div class="flex-grow"></div>
		<NavbarItem link="/register" icon="mingcute:user-add-2-line">Register</NavbarItem>
		<NavbarItem link="/theme" icon="mingcute:paint-brush-ai-line">Themes</NavbarItem>
		<HorizontalSeparator gradient/>
		<NavbarItem link="/settings" icon="mingcute:settings-1-line">Settings</NavbarItem>
		<NavbarItem link="/about" icon="mingcute:information-line">About</NavbarItem>
	</Navbar>
	<div id="content_container" class="flex p-4 m-0 w-full max-w-[960px] overflow-x-clip min-h-screen h-fit justify-center">
		{@render children()}
	</div>
	<div id="unused_allocator" class="sticky h-screen z-10 top-0 left-0 flex-auto"></div>
</div> 
<!-- <nav>
	<a href="/">Home</a>
	<a href="/u">u</a>
	<a href="/register">reg</a>
	<a href="/theme">theme</a>
</nav> -->

