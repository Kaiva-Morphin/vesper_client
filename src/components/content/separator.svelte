<script lang="ts">
    let {
        gradient = false,
    } : {
        gradient?: boolean,
    } = $props();
</script>
<div class={`w-full h-[32px] ${gradient ? "gradient_horizontal_separator" : "horizontal_separator"}`}></div>

<style>
:global {
    .horizontal_separator {
        width: 100%;
        max-height: var(--border);
        height: var(--border);
        border-radius: var(--border);
        background-image: linear-gradient(115deg, 
            color-mix(in oklch, var(--color-primary) 90%, transparent), 
            color-mix(in oklch, var(--color-secondary) 90%, transparent)
        );
    }
    .gradient_horizontal_separator {
        width: 100%;
        max-height: var(--border);
        height: var(--border);
        background-image: linear-gradient(115deg, 
                color-mix(in oklch, var(--color-primary) 0%, transparent), 
                color-mix(in oklch, var(--color-primary) 40%, transparent), 
                color-mix(in oklch, var(--color-secondary) 40%, transparent),
                color-mix(in oklch, var(--color-secondary) 0%, transparent)
            );
    }

}
</style>