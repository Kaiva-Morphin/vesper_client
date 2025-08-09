<script lang="ts">
    import { closeFloating, DefaultWindow, FLOATING_CONTAINER_ID, FLOATING_PREFIX, handleMouseDown, handleResizeStart, openFloating, vec2, WINDOWS, type FloatingWindow } from "$lib/window/floating.svelte";
    import { onMount } from "svelte";
    import MiniprofilePopup from "./miniprofile_popup.svelte";
    import { USER_GUID } from "$lib/token.svelte";
    import { get } from "svelte/store";
    function openProfileWindow(guid: string) {
        openFloating({
            ...DefaultWindow,
            component: MiniprofilePopup,
            min_size: vec2(265, 300),
            size: vec2(265, 300), //340 120
            max: vec2(300, 600),
            id: "miniprofile_test",
            type: {mode: "follow", id: guid},
            props: {
                window_id: "miniprofile_test",
                user_id: guid,
            }
        } as FloatingWindow); 
    }
    USER_GUID.subscribe(guid => {
        if (guid) {
            closeFloating("miniprofile_test")
            openProfileWindow(guid);
        }
    })
    onMount(() => {
        let guid = get(USER_GUID);
        if (guid) {
            openProfileWindow(guid)
        }
    })
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-screen vh absolute z-300 bottom-0 flex pointer-events-none" id={FLOATING_CONTAINER_ID}>
    {#each Object.entries($WINDOWS) as [id, w] (id)}
        <div 
            id="{FLOATING_PREFIX}{id}"
            class="absolute shadow-lg pointer-events-auto translate-x-[-50%] translate-y-[-50%] { w.type.mode === "floating" ? "cursor-grab active:cursor-grabbing" : "" }" 
            style="top: calc(50% + {w.pos.y}px); left: calc(50% + {w.pos.x}px); width: {w.size.x}px; height: {w.size.y}px; z-index: {w.z_index};">
            {#if w.type.mode === "floating"}
                <div class="z-[250] absolute -top-1 w-full h-2 cursor-n-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1000)}></div>
                <div class="z-[250] absolute -bottom-1 w-full h-2 cursor-s-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0100)}> </div>
                <div class="z-[250] absolute -left-1 h-full w-2 cursor-w-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0010)}></div>
                <div class="z-[250] absolute -right-1 h-full w-2 cursor-e-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0001)}></div>
                <div class="z-[250] absolute -bottom-1 -right-1 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0101)}></div>
                <div class="z-[250] absolute -top-1 -right-1 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1001)}></div>
                <div class="z-[250] absolute -bottom-1 -left-1 w-2 h-2 cursor-nesw-resize" onmousedown={(e) => handleResizeStart(e, w, 0b0110)}></div>
                <div class="z-[250] absolute -top-1 -left-1 w-2 h-2 cursor-nwse-resize" onmousedown={(e) => handleResizeStart(e, w, 0b1010)}></div>
            {/if}
            {#if w.dbg}{w.dbg}{/if}
            <svelte:component this={w.component} {...w.props}>
                <div class="w-full h-full z-250" slot="draggable" onmousedown={(e) => {handleMouseDown(e, w, id)}}></div>
            </svelte:component>
        </div>
    {/each}
</div>