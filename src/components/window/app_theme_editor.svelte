<script lang="ts">
    import Icon from "@iconify/svelte";
    import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
    import { appThemeTypes, THEME} from "$lib/theme/app.svelte";
    import BorderCheckbox from "../content/border_checkbox.svelte";
    import { easeOutQuint } from "$lib/util.svelte";
    import { closeFloating } from "$lib/window/floating.svelte";
    import { fade, fly, scale } from "svelte/transition";
    
    let {id} : {id : string} = $props()
    let viewport
    let contents
</script>




<!-- out:fly={{ y: 1000, duration: 250, easing: (t: number): number => {return 1 - Math.pow(1 - t, 3);} }} -->
<!-- in:fly={{ y: 1000, duration: 250, easing: (t: number): number => {return 1 - Math.pow(1 - t, 3);} }} -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
<style>
    .shadow {
        box-shadow: 0px 1px 4px 4px #000A;
    }
</style>
<div class="flex flex-col card-base card-100 card-100-border w-full max-h-full h-full shadow" 
out:fly={{ y: 100, duration: 250, easing: easeOutQuint }}
in:scale={{duration: 300, easing: easeOutQuint, start: 0.5}}
>
    <div class="w-full h-[32px] min-h-[32px] flex relative">
        <slot name=draggable></slot>
        <button class="pr-2 cursor-pointer"><Icon icon="mingcute:close-fill" class="hover:text-gray-500" onclick={() => closeFloating(id)}/></button>
        <div class="w-full absolute bottom-0 horizontal_separator "></div>
    </div>
    <div class="w-full flex-grow cursor-auto">
        <div bind:this={viewport} class="viewport w-full h-full overflow-y-scroll">
            <!-- dont ask, idk -->
            <div bind:this={contents} class="grid h-[1px] gap-2 p-2
                    no-alpha  dark-picker
                    "
                    >
                {#each appThemeTypes.fake_rgba as t}
                    <ColorPicker
                        label={$THEME[t].display_name}
                        isAlpha={false}
                        bind:rgb={$THEME[t].value as RgbaColor}
                    />
                {/each}

                <div class="flex items-center gap-2 col-span-full">
                    <label class="cursor-pointer flex items-center gap-2 pl-2">
                        <BorderCheckbox bind:checked={$THEME.neo.value} class="checkbox-primary"/>
                        Neo theme?
                    </label> 
                </div>

                {#each appThemeTypes.px as t}
                    <div class="flex items-center font-semibold">{$THEME[t].display_name}</div>
                    <input type="range" min="0" max="20" class="range w-full" bind:value={$THEME[t].value} />
                {/each}

                {#each appThemeTypes.percent as t}
                    <div class="flex items-center font-semibold">{$THEME[t].display_name}</div>
                    <input type="range" min="0" max="20" class="range w-full" bind:value={$THEME[t].value} />
                {/each}
            </div>
        </div>
        <!-- <Svrollbar {viewport} {contents} /> -->
    </div>
    
</div>
