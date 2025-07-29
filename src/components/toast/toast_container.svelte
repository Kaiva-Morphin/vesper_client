<script lang="ts">
  import { easeOutQuint, easeOutQuart } from '$lib/util.svelte';
  import { fly, slide } from 'svelte/transition';
  import { isPaused, items } from '$lib/toast.svelte';

  function removeItem(index: number) {
    items.update((list) => {
      list.splice(index, 1);
      return [...list];
    });
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="container absolute bottom-0 right-0 w-[256px] h-fit p-4 space-y-2 z-20"
  on:mouseenter={() => ($isPaused = true)}
  on:mouseleave={() => ($isPaused = false)}
>
  <ul class="space-y-1">
    {#each $items as item, i (item)}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li
        on:click={() => removeItem(i)}
        in:fly={{ x: 400, duration: 300, opacity: 0.3, easing: easeOutQuart }}
        out:slide={{ duration: 250, easing: easeOutQuint }}
        class="overflow-visible relative"
      >
        <div
          class={`flex justify-between items-center btn border-0 px-4 item relative overflow-clip ${item.style}`}
          out:fly={{ x: 400, duration: 300, opacity: 0.5, easing: easeOutQuint }}
        >
          <span>{item.label}</span>
        <div
            class="lifetime-bar"
            style="animation-play-state: {$isPaused ? 'paused' : 'running'}"
            data-created={item.createdAt}
          ></div>
        </div>
        
      </li>
    {/each}
  </ul>
  
</div>
<style>
  @keyframes appear {
    from {
      height: 0;
    }
    to {
      height: 52px;
    }
  }
  .item {
    border-radius: var(--radius-box);
    box-shadow: 0 0 12px #000;
    animation: appear 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  li {
    position: relative;
  }
  .lifetime-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: color-mix(in srgb, var(--btn-fg) 50%, #FFF0);
    width: 100%;
    animation-name: shrink-width;
    animation-duration: 5s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  @keyframes shrink-width {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
</style>
