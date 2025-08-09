<script lang="ts">
  import { easeOutQuint, sleep } from '$lib/util.svelte';
  import { closeFloating } from '$lib/window/floating.svelte';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { fly, scale } from 'svelte/transition';
  import { Svrollbar } from 'svrollbar'
    let {
        id,
        em_id,
        onclose,
        refresh_preview = () => {},
    } : {
        id : string,
        em_id: string,
        onclose? : (() => void),
        refresh_preview? : (() => void)
    } = $props()
  const items = Array.from({ length: 50 }).map((_, i) => `item ${i}`)

  let viewport: Element;
  let contents: Element;
  let contentsReady = false;
  onMount(async () => {
        await sleep(350)
        contentsReady = true
  })
</script>
<!-- out:fly={{ y: 100, duration: 250, easing: easeOutQuint }} -->
<!-- in:scale={{duration: 300, easing: easeOutQuint, start: 0.5}} -->
<div class="flex flex-col card-base card-100 card-100-border w-full max-h-full h-full shadow" 

>
    <div class="w-full h-[32px] min-h-[32px] flex relative">
        <slot name=draggable></slot>
        <button class="pr-2 cursor-pointer"><Icon icon="mingcute:close-fill" class="hover:text-gray-500" onclick={() => {closeFloating(id)}}/></button>
        <div class="w-full absolute bottom-0 horizontal_separator "></div>
    </div>
<div class="wrapper">
  <div bind:this={viewport} class="viewport">
    <div bind:this={contents} class="contents">
      {#each items as item (item)}
        <div>{item}</div>
      {/each}
    </div>
  </div>
  {#if viewport && contentsReady}
  <Svrollbar {viewport} {contents} />
  {/if}
</div>
</div>

<style>
  .wrapper {
    position: relative;
    width: 10rem;
  }

  .viewport {
    position: relative;
    width: 10rem;
    height: 10rem;
    overflow: scroll;
    border: 1px solid gray;
    box-sizing: border-box;

    /* hide scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .viewport::-webkit-scrollbar {
    /* hide scrollbar */
    display: none;
  }
</style>

