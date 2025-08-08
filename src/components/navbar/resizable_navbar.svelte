<script lang="ts">
    import { localState } from "$lib/util.svelte";
    import { writable } from "svelte/store";
    import NavbarItem from "./item.svelte";
    import { Svrollbar, Svroller } from "svrollbar";
  import { USER_UID } from "$lib/token.svelte";
    // todo!
    let show_on_hover = writable(false) //localState("sidebar_show_collapsed_on_hover", false);
    let states = [0, 48, 200];
    let target_width = $state(states[1]);
    let alloc = $state(states[1]);
    // svelte-ignore state_referenced_locally
    let flex_basis = localState("sidebar_position", target_width);

    flex_basis.subscribe(new_val => {
        if ($show_on_hover) {
            target_width = Math.max(new_val, states[1]);
            alloc = target_width == states[1] ? 0 : states[2];
        } else {
            target_width = new_val;
            alloc = new_val;
        }
    })
 

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
            flex_basis.set(0);
            for (var edge of edges) {
                if (x > edge.edge) {
                    flex_basis.set(edge.pos);
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
    let viewport
    let contents
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
	
    @property --w {
        syntax: "<number>";
        inherits: false;
        initial-value: 0px;
    }
    :global {
    .sidebar {
        padding: 4px 5px 4px 3px;
        backdrop-filter: blur(8px);
        border-radius: 0 var(--radius-box) var(--radius-box) 0;
		position: absolute;
		box-sizing: border-box;
		min-width: 0;
        /* background: color-mix(in srgb, var(--color-primary) 3%, #0000); */
        background: var(--bg-straight);
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 30%, #0000);
        overflow-y:scroll;
        transition-property: width, --w;
        transition-duration: 0.1;
        transition-timing-function: cubic-bezier(0.5, 1, 0.89, 1);
        width: 0;
        /* width: calc(max(var(--w), var(--target))); */

	}
    /* .sidebar:hover, */
    .sidebar:has(+ div > div > div > div > .resizer:hover),
    .sidebar:has(+ div > div > div > div > .resizer:active)
    {
        box-shadow: inset -2px 0px 3px -1px color-mix(in srgb, var(--color-secondary) 50%, #0000);
        flex-basis: 2px;
        width: var(--on-hover);
        translate: 0px 0px;
    }
    }
	.resizer {
		flex-basis: 0px;
		position: relative;
        cursor: ew-resize;
        z-index: 100;
        /* border-left: 2px solid #33364240; */
        /* box-shadow: var(--box-shadow); */
        /* box-shadow: -4px 0 4px color-mix(in srgb, var(--color-secondary) 10%, #0000); */
		box-sizing: border-box;
        flex: -1 -1 auto;

        /* translate: var(--t) 0px; */
	}
    .resizer_handle {
        position: absolute;
        width: 6px;
        height: 100%;
        /* background: red; */
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
    :global {
        
        .mirror_alloc_provider {
            --alloc: var(--alloc-outer);
            background: var(--a);
        }
        .sidebar_mirror_alloc {
            max-width: var(--alloc);
            flex: 1 0 auto;
        }
    }

    .wrapper {
        position: relative;
    }
:global {
    .viewport {
        position: relative;
        overflow: scroll;
        box-sizing: border-box;

        /* hide scrollbar */
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .viewport::-webkit-scrollbar {
        /* hide scrollbar */
        display: none;
    }
}
</style>

<div class="w-full max-vh">
    <!-- {#if $flex_basis > 0} -->

    <!-- --t: {$flex_basis == 0 || $show_on_hover ? "-10" : "0"}px; -->

    <div class="absolute vh z-30 sidebar flex flex-col gap-1 no-scrollbar" style="
    --on-hover: {target_width}px;
    {$show_on_hover ? "" : "width: " + target_width + "px;"}
    {target_width == 0 ? "display: none;" : ""}
    "
    >
    <NavbarItem link="/0playground" icon="mingcute:bug-line">0playground</NavbarItem>
        <div class="flex-grow"></div>
        {#if $USER_UID == null}
        <NavbarItem link="/us" icon="mingcute:user-search-line">Users</NavbarItem>
        <NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
        <div class="flex-grow"></div>
        <NavbarItem link="/login" icon="mingcute:user-add-2-line">Login</NavbarItem>
        {:else}
        <NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
        <NavbarItem link="/us" icon="mingcute:user-search-line">Users</NavbarItem>
        <div class="flex-grow"></div>
        <NavbarItem link="/u/{$USER_UID}" icon="mingcute:user-3-line">Profile</NavbarItem>
        {/if}
        <NavbarItem link="/settings" icon="mingcute:settings-1-line">Settings</NavbarItem>
        <NavbarItem link="/about" icon="mingcute:information-line">About</NavbarItem>
    </div>
    




    <div class="wrapper flex-grow">
        <div bind:this={viewport} class="viewport w-full">
            <div bind:this={contents} class="contents ">
            <div style="--alloc-outer: {alloc}px" class="flex flex-row overflow-x-clip -z-100 vh mirror_alloc_provider" >
                {#if target_width > 0}
                    <div class="max-vh w-[30px]" style="flex-basis: {alloc}px">
                    </div>  
                {/if}

                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="resizer" onmousedown={handleMouseDown}>
                    <div class="resizer_handle {target_width == 0 ? "visible_handle":""}"></div>
                </div>
                <slot />

            </div>
            </div>
        </div>
        <Svrollbar {viewport} {contents} />
    </div>
</div> 

