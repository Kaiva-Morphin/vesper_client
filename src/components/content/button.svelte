<script lang="ts">
    import Icon from "@iconify/svelte";
    let {
        icon = null,
        class:classExtra=null,
        collapsed_opacity=null,
    } = $props();

</script>

<button
    class="btn {classExtra} flex overflow-clip p-0 gap-0 {collapsed_opacity?"collapsable":""}"
    style="--op:{collapsed_opacity}"
>
    {#if icon}
    <Icon icon={icon} height=24px class="ml-[6px]"></Icon>
    {/if}
    <div class='ml-[6px]'>
        <slot></slot>
    </div>
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