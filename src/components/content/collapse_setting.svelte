<script lang="ts">
    import Icon from "@iconify/svelte";
    let { icon, open = false } = $props();
    let opened = $state(open);
</script>






    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
     <!-- bg-[#0005] -->
<div tabindex="0" class="collapse collapse-arrow card-200">
    <input type="checkbox" bind:checked={opened}/>
    <div class="collapse-title font-semibold flex flex-row gap-2 items-center text-2xl ">
        <Icon height=32px icon={icon}/>
        <slot name="title"/>
    </div>
    <div class="collapse-content text-sm">
        <slot name="content"/>
    </div>
</div>