<script lang="ts">
    import NavbarItem from "./item.svelte";

    
    let states = [0, 48, 200];
	let flexBasis = $state(states[1]);
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
	.content_wrapper {
		position: relative;
		/* height: 100%; */
        /* width: 100%; */
		display: flex;
		flex-direction: column;
		overflow: visible;
	}

	.content_container {
		/* height: 100%; */
        /* width: 100%; */
		display: flex;
		box-sizing: border-box;
	}

	.sidebar {
        padding: 4px 5px 4px 3px;
        backdrop-filter: blur(3px);
        border-radius: 0 var(--radius-box) var(--radius-box) 0;
		position: relative;
		box-sizing: border-box;
		min-width: 0;
        /* background: color-mix(in srgb, var(--color-primary) 3%, #0000); */
        background: var(--bg-straight);
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 30%, #0000);
        overflow-y:scroll;
	}
    .sidebar:has( + .resizer:hover), .sidebar:has( + .resizer:active) {
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 50%, #0000);
        flex-basis: 2px;
    }
	.resizer {
		flex-basis: 0px;
		position: relative;
		z-index: 2;
        cursor: ew-resize;
        /* border-left: 2px solid #33364240; */
        /* box-shadow: var(--box-shadow); */
        /* box-shadow: -4px 0 4px color-mix(in srgb, var(--color-secondary) 10%, #0000); */
		box-sizing: border-box;


	}
    .resizer_handle {
        position: absolute;
        width: 6px;
        height: 100%;
        /* box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 30%, #0000); */
    }
    .visible_handle::after {
        content: "";
        position: absolute;
        height: 100%;
        width: 6px;
        translate: -6px 0px;
        background: var(--bg-straight);
        transition: translate linear 50ms;
    }

    .visible_handle:hover::after, .visible_handle:active::after {
        translate: 0px 0px;
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 50%, #0000);
    }

    /* .resizer_handle:hover, .resizer_handle:active  {
        background-color: rgba(255, 0, 0, 1.0);
    } */

    .bg-video {
        z-index: -10;
        left: 50%;
        transform: translateX(-50%);
    }

</style>

<div class="content_wrapper">
	<div class="content_container overflow-y-scroll">
        {#if flexBasis > 0}
		<div
			style:flex-basis={`${flexBasis}px`}
            class = "sidebar flex flex-col gap-1 no-scrollbar"
		>
                <NavbarItem link="/" icon="mingcute:home-4-line">Home</NavbarItem>
                <NavbarItem link="/u" icon="mingcute:user-search-line">Users</NavbarItem>
                <NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
                <NavbarItem link="/social" icon="mingcute:group-3-line">Social</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <div class="flex-grow"></div>
                <NavbarItem link="/0playground" icon="mingcute:bug-line">0playground</NavbarItem>
                <NavbarItem link="/scroll" icon="mingcute:mouse-line">Scroll test</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <div class="flex-grow"></div>
                <NavbarItem link="/u/test_user" icon="mingcute:user-3-line">User</NavbarItem>
                <NavbarItem link="/register" icon="mingcute:user-add-2-line">Register</NavbarItem>
                <NavbarItem link="/theme" icon="mingcute:paint-brush-ai-line">Themes</NavbarItem>
                <!-- <HorizontalSeparator gradient/> -->
                <NavbarItem link="/settings" icon="mingcute:settings-1-line">Settings</NavbarItem>
                <NavbarItem link="/about" icon="mingcute:information-line">About</NavbarItem>
		</div>
        {/if}
		<!-- svelte-ignore event_directive_deprecated -->
	    <!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="resizer" onmousedown={handleMouseDown}>
            <div class="resizer_handle {flexBasis == 0? "visible_handle":""}"></div>
        </div>
        <slot/>
	</div>
</div>

