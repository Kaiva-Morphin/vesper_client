<script lang="ts">
    import NavbarItem from "./item.svelte";

    
    let states = [0, 48, 200];
	let flexBasis = $state(states[2]);
    let edges : {edge: number, pos: number}[] = [];
    var prev = null;
    for (var s of states) {
        if (prev == null) {
            prev = s;
            continue;
        }
        edges.push({edge: (prev + s) * 0.5, pos:s});
        prev = s;
    }
	function handleMouseDown() {
		function resize(e: MouseEvent) {
            let x = e.clientX;
            flexBasis = 0;
            for (var edge of edges) {
                if (x > edge.edge) {
                    flexBasis = edge.pos;
                }
            }
		}
		function stop() {
			window.removeEventListener('mousemove', resize);
			window.removeEventListener('mouseup', stop);
		}

		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', stop);
	}

</script>

<style>
	#wrapper {
		position: relative;
		height: 100%;
        width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	#container {
		height: 100%;
        width: 100%;
		display: flex;
		overflow: hidden;
		box-sizing: border-box;
	}

	#sidebar {
        padding: 4px 5px 4px 3px;
        backdrop-filter: blur(3px);
        border-radius: 0 var(--radius-box) var(--radius-box) 0;
		position: relative;
		box-sizing: border-box;
		min-width: 0;
        overflow: hidden;
        /* background: color-mix(in srgb, var(--color-primary) 3%, #0000); */
        background: var(--bg-straight);
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 30%, #0000);
        overflow-y:scroll;
	}
    #sidebar:has( + #resizer:hover), #sidebar:has( + #resizer:active) {
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 50%, #0000);
    }
	#resizer {
		flex-basis: 5px;
		position: relative;
		z-index: 2;
        cursor: ew-resize;
		background: none;
        /* border-left: 2px solid #33364240; */
        /* box-shadow: var(--box-shadow); */
        /* box-shadow: -4px 0 4px color-mix(in srgb, var(--color-secondary) 10%, #0000); */
		box-sizing: border-box;
	}
</style>

<div id="wrapper">
	<div id="container">
        {#if flexBasis > 0}
		<div
			id="sidebar"
			style:flex-basis={`${flexBasis}px`}
            class = "flex flex-col gap-1 no-scrollbar"
		>
                <NavbarItem link="/" icon="mingcute:home-4-line">Home</NavbarItem>
                <NavbarItem link="/u" icon="mingcute:user-search-line">Users</NavbarItem>
                <NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
                <NavbarItem link="/social" icon="mingcute:group-3-line">Social</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <div class="flex-grow"></div>
                <NavbarItem link="/scroll" icon="mingcute:mouse-line">Scroll test</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <div class="flex-grow"></div>
                <NavbarItem link="/register" icon="mingcute:user-add-2-line">Register</NavbarItem>
                <NavbarItem link="/theme" icon="mingcute:paint-brush-ai-line">Themes</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <NavbarItem link="/settings" icon="mingcute:settings-1-line">Settings</NavbarItem>
                <NavbarItem link="/about" icon="mingcute:information-line">About</NavbarItem>
		</div>
        {/if}
		<!-- svelte-ignore event_directive_deprecated -->
	    <!-- svelte-ignore a11y_no_static_element_interactions -->
		<div id="resizer" onmousedown={handleMouseDown}></div>
        <div id="content_container" class="min-w-fit h-full flex-grow relative overflow-y-scroll overflow-x-clip flex justify-center">
			<slot/>
		</div>
	</div>
</div>
