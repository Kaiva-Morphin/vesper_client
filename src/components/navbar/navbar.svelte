<script lang="ts">
</script>

<main id="vertical_navbar" class="min-w-[12rem] sticky h-full top-0 left-0 flex-auto max-w-content overflow-y-scroll overscroll-contain no-scrollbar">
    <div class="vertical_navbar absolute right-0 h-fit top-0 w-[12rem] flex flex-col min-h-screen z-10 p-4">
        <slot></slot>
    </div>
</main>


<style>
    :global([data-neo]) .vertical_navbar {
        gap: calc(2 * var(--border));
    }
</style>

