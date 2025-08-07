<script lang="ts">
    let {
        gradient = false,
    } : {
        gradient?: boolean,
    } = $props();
</script>
<div class={`w-full h-[32px] ${gradient ? "gradient_horizontal_separator" : "horizontal_separator"}`}></div>

<style>

</style>