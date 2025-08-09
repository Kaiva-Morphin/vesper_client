<script lang="ts">
    import Icon from "@iconify/svelte";
    let {
        icon = null,
        class:classExtra=null,
        collapsed_opacity=null,
        request = false,
        loading = false,
        onclick = (e: MouseEvent) : void => {}
    } = $props();
    let is_loading = $state(false);
</script>

<button
    class="btn {classExtra} flex overflow-clip p-0 gap-0 {collapsed_opacity?"collapsable":""}"
    style="--op:{collapsed_opacity}"
    onclick={async (e) => {
        if (is_loading || loading) {return}
        if (request) {is_loading = true}
        await onclick(e);
        is_loading = false;
    }}
>
    {#if is_loading || loading}
        <Icon icon="svg-spinners:gooey-balls-1" height=24px></Icon>
    {:else}
        {#if icon}
        <Icon icon={icon} height=24px class="ml-[6px]"></Icon>
        {/if}
        <div class='ml-[6px]'>
            <slot></slot>
        </div>
    {/if}
</button>

<style>

.collapsable {
    opacity: var(--op);
    width: 38px;
}
.collapsable:hover {
    opacity: 1;
    width: fit-content;
}

.collapsable div {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 0.8s ease, opacity 0.5s ease;
    opacity: var(--op);
}

.collapsable:hover div {
    max-width: 160px;
    opacity: 1;
}

</style>