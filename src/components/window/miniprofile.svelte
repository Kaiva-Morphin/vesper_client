<script lang="ts">
    import Icon from "@iconify/svelte";
    import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
    import { appThemeTypes, THEME} from "$lib/theme/app.svelte";
    import BorderCheckbox from "../content/border_checkbox.svelte";
    import { easeOutQuint } from "$lib/util.svelte";
    import { closeFloating } from "$lib/window/floating.svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { applyMiniprofileTheme, DEFAULT_MINIPROFILE_THEME, miniprofileThemeTypes, type MiniprofileTheme } from "$lib/theme/miniprofile.svelte";
    import { writable, type Writable } from "svelte/store";
    import { CssStyleProperty } from "$lib/theme/abstraction.svelte";
    
    /*
    constructor(
        key: string,
        css_key: string,
        display_name: string,
        typename: keyof TypeMap,
        value: T,
        data_key?: string
    ) {
        this.key = key;
        this.css_key = css_key;
        this.display_name = display_name;
        this.value = value;
        this.typename = typename;
        this.data_key = data_key;
    }
    
    */
    let {
        id,
        em_id,
        initial_theme
    } : {
        id : string,
        em_id: string,
        initial_theme: MiniprofileTheme | null
    } = $props()

    let theme = initial_theme ?? DEFAULT_MINIPROFILE_THEME;

    let EDITABLE_MINIPROFILE : Writable<MiniprofileTheme> = writable(theme);

    EDITABLE_MINIPROFILE.subscribe(theme => {
        let em = document.getElementById(em_id);
        if (em) applyMiniprofileTheme(theme, em);
    });
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
                {#each miniprofileThemeTypes.RgbaColor as t}
                    <ColorPicker
                        label={$EDITABLE_MINIPROFILE[t].display_name}
                        isAlpha={false}
                        bind:rgb={$EDITABLE_MINIPROFILE[t].value as RgbaColor}
                    />
                {/each}

                {#each miniprofileThemeTypes.px as t}
                    <div class="flex items-center font-semibold">{$EDITABLE_MINIPROFILE[t].display_name}</div>
                    <input type="range" min="0" max="20" class="range w-full" bind:value={$EDITABLE_MINIPROFILE[t].value} />
                {/each}

                {#each miniprofileThemeTypes.percent as t}
                    <div class="flex items-center font-semibold">{$EDITABLE_MINIPROFILE[t].display_name}</div>
                    <input type="range" min="0" max="20" class="range w-full" bind:value={$EDITABLE_MINIPROFILE[t].value} />
                {/each}
            </div>
        </div>
    </div>
</div>
