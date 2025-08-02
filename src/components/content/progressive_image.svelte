<script lang="ts">
  import Icon from "@iconify/svelte";

  let { 
    class: extra_class = "",
    low, 
    high, 
    alt, 
    size = null 
  }: { 
    class?: string, 
    low: string, 
    high: string, 
    alt: string,
    size?: [number, number] | null
  } = $props();
  const match = low.match(/_(\d+)x(\d+)\.jpg$/);
  let width = size?size[0]:match?+match[1]:0;
  let height = size?size[1]:match?+match[2]:0;
  let loaded = $state(false);

  const aspectRatio = height && width ? (height / width) * 100 : 0;
</script>

<style>
  .image-wrapper {
    position: relative;
    display: block;
  }

  .image-wrapper::before {
    content: "";
    display: block;
    padding-bottom: var(--aspect-ratio, 56.25%);
  }

  .image-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .lowres {
    image-rendering: pixelated;
    z-index: 1;
  }

  .highres {
    z-index: 2;
    transition: opacity 0.4s;
    opacity: 0;
  }

  .highres.loaded {
    opacity: 1;
  }
</style>

<div
  class="image-wrapper {extra_class} flex items-center"
  style="--aspect-ratio: {aspectRatio}%;"
>
  <div class="my-skeleton w-full h-full absolute top-0 left-0"></div>
  <img class="lowres" src="{low}" alt="" 
  onerror={(em: any) => {em.currentTarget.src=alt; em.currentTarget.style.display="none"}}
  />
  <img
    class="highres {loaded ? 'loaded' : ''}"
    src="{high}"
    alt=""
    onerror={(em: any) => {em.currentTarget.src=alt;}}
    onload={() => loaded = true}
  />
</div>
