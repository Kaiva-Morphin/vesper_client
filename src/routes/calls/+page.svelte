<script lang="ts">
    import { localState } from "$lib/util.svelte";
  import Icon from "@iconify/svelte";
    import { get, type Writable } from "svelte/store";
    import { Svroller } from "svrollbar";
  import Channel from "../../components/calls/channel.svelte";
  import CallMembers from "../../components/calls/call_members.svelte";

    type Resizer = {
        max: number,
        min: number,
        base: number,
        start: number,
    }
    let calls_resizer = {
        max: 400,
        min: 160,
        base: 0,
        start: 0,
    }
    let calls_val = localState("calls_list_resizer_position", calls_resizer.max);
    calls_val.set(Math.min(calls_resizer.max, get(calls_val)));
    let chat_resizer = {
        max: 512,
        min: 256,
        base: 0,
        start: 0,
    }
    let chat_val = localState("chat_list_resizer_position", chat_resizer.max);
    chat_val.set(Math.min(chat_resizer.max, get(chat_val)));
    function handleMouseDown(e: MouseEvent, resizer: Resizer, val: Writable<number>, inv: boolean = false) {
        resizer.base = get(val);
        resizer.start = e.clientX;
		function resize(e: MouseEvent) {
            let calls_dt = e.clientX - resizer.start;
            let current = inv ? resizer.base - calls_dt : resizer.base + calls_dt;
            let target = Math.min(resizer.max, Math.max(resizer.min, current)); 
            if (current < resizer.min * 0.5) {
                target = 0;
            }
            val.set(target);
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
.resizer {
    cursor: ew-resize;
}
</style>
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class=" vh flex-grow flex">
    <div class="w-[128px] max-vh card-100 card-base card-100-border flex flex-col gap-2 p-2 {$calls_val == 0 ? 'hidden' : ''}" style="flex-basis:{$calls_val}px">
        <Channel></Channel>
        <Channel private></Channel>
    </div>
    <div class="relative h-full {$calls_val > 0 ? 'w-1' : ''}">
        <div class="z-10 absolute h-full resizer w-[12px] hover:bg-[#FFF2]" 
        onmousedown={(e) => {handleMouseDown(e, calls_resizer, calls_val)}}></div>
    </div>
    <div class="flex-grow h-full card-100 card-base card-100-border flex">
        <div class="flex-grow h-full">
            <CallMembers></CallMembers>
        </div>
        <div class="relative h-full w-1">
            <div class="z-10 absolute hover:bg-[#FFF2] h-full resizer w-[12px]" 
            onmousedown={(e) => {handleMouseDown(e, chat_resizer, chat_val, true)}}></div>
        </div>
        <div class="w-[128px] h-full border-l-2 border-[#8881]" style="flex-basis:{$chat_val}px"></div>
    </div>
</div>
