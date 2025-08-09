<script lang="ts">
    import { Svrollbar } from 'svrollbar'
    let {class: extra_class = "", style: extra_style = "", viewport_class="", content_class=""} = $props();

    let viewport: HTMLElement | null = $state(null);
    let contents: HTMLElement | null = $state(null);
</script>



<style>
  .wrapper {
    position: relative;
  }
  .viewport {
    position: relative;
    overflow: scroll;
    box-sizing: border-box;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .viewport::-webkit-scrollbar {
    display: none;
  }
</style>


<div class="wrapper {extra_class}" style={extra_style}>
      <div bind:this={viewport} class="viewport {viewport_class}">
        <div bind:this={contents} class={content_class}>
            <slot></slot>
        </div>
      </div>
      <Svrollbar {viewport} {contents} />
  </div>