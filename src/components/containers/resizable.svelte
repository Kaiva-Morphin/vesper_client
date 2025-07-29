<script lang="ts">
    let {
        bounds = null,
        start_size = null,
    } : {
        bounds: {states: number[]} | {bounds: [number, number]} | null,
        start_size: number | null,

    } = $props();

    let states = [0, 100, 325];
	let flexBasis = $state(states[0]);
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
    let a = false;
</script>

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="resizable_wrapper">
	<div id="resizable_container">
		<div
			id="resizable_sidebar"
			style:flex-basis={`${flexBasis}px`}
		>
			<slot name="sidebar"/>
		</div>
		<div id="resizable_resizer" on:mousedown={handleMouseDown}></div>
        <div id="content_container" class="w-screen h-full relative overflow-y-scroll overflow-x-clip flex justify-center">
			<slot name="content"/>
		</div>
	</div>
</div>

<style>


#resizable_container {
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#resizable_wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0;
    padding: 0;
}



#resizable_sidebar {
    height: 100%;
    position: relative;
    box-sizing: border-box;
    background: lightgray;
    border: 2px solid darkgray;
    min-width: 0;
}

#resizable_resizer {
    flex-basis: 5px;
    position: relative;
    z-index: 2;
    cursor: ew-resize;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.4);
    background: #333642;
    box-sizing: border-box;
}


</style>