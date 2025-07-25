<script lang="ts"></script>
<div class="w-full flex relative justify-center bg-inherit">
    <div class="absolute w-full left_separator self-center"></div>
    <div class="z-10 bg-inherit px-2 w-fit"><slot/></div>
</div>

<style>
:global {
    .left_separator {
        width: 100%;
        max-height: var(--border);
        height: var(--border);
        border-radius: var(--border);
        background-image: linear-gradient(115deg, 
            color-mix(in oklch, var(--color-primary) 90%, transparent), 
            color-mix(in oklch, var(--color-secondary) 90%, transparent)
        );
    }
}
</style>