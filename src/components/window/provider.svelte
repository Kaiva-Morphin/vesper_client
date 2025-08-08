<script lang="ts">
    import { FLOATING_CONTAINER_ID, FLOATING_PREFIX, handleMouseDown, handleResizeStart, WINDOWS } from "$lib/window/floating.svelte";
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-screen vh absolute z-300 bottom-0 flex pointer-events-none" id={FLOATING_CONTAINER_ID}>
    {#each Object.entries($WINDOWS) as [id, w] (id)}
        <div 
            id="{FLOATING_PREFIX}{id}"
            class="absolute shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing translate-x-[-50%] translate-y-[-50%]" 
            style="top: calc(50% + {w.pos.y}px); left: calc(50% + {w.pos.x}px); width: {w.size.x}px; height: {w.size.y}px; z-index: {w.z_index};">
            <div class="z-[250] absolute -top-1 w-full h-2 cursor-n-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1000)}></div>
            <div class="z-[250] absolute -bottom-1 w-full h-2 cursor-s-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0100)}> </div>
            <div class="z-[250] absolute -left-1 h-full w-2 cursor-w-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0010)}></div>
            <div class="z-[250] absolute -right-1 h-full w-2 cursor-e-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0001)}></div>
            <div class="z-[250] absolute -bottom-1 -right-1 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0101)}></div>
            <div class="z-[250] absolute -top-1 -right-1 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1001)}></div>
            <div class="z-[250] absolute -bottom-1 -left-1 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0110)}></div>
            <div class="z-[250] absolute -top-1 -left-1 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1010)}></div>
            <svelte:component this={w.component} {...w.props}>
                <div class="w-full h-full z-250" slot="draggable" onmousedown={(e) => {handleMouseDown(e, w, id)}}></div>
            </svelte:component>
        </div>
    {/each}
</div>