<script lang="ts">
    import Icon from "@iconify/svelte";
    import CollapseSetting from "../../components/content/collapse_setting.svelte";

    import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
    import { default_themes, appThemeTypes, setDefaultTheme, THEME} from "$lib/theme/app.svelte";
    import { get } from "svelte/store";
    import LabelSeparator from "../../components/content/label_separator.svelte";
    import BorderInput from "../../components/content/border_input.svelte";
    import BorderCheckbox from "../../components/content/border_checkbox.svelte";
    import { updated } from "$app/state";

    
</script>


<div 
style=""
class="flex-grow flex justify-center relative vh min-w-[900px] p-2"
>


<div class="w-full flex justify-center relative">
    <div class="w-full flex flex-col h-fit max-w-[900px] p-2 card-base card-100 card-100-border gap-2">
        <CollapseSetting icon="mingcute:paint-brush-ai-line" open>
            <!-- TODO: ACTIVE STYLE -->
            <div slot="title">Theme</div>
            <div slot="content" class="dark-picker h-200 flex flex-col gap-2 bg-[var(--tinted-sec-200o)]">
                <LabelSeparator><h2>Default presets</h2></LabelSeparator>
                <div class="grid grid-cols-4 gap-2">
                    {#each default_themes as t}
                        <button class="w-full h-fit flex flex-row items-center justify-between p-2 card-base card-100 card-100-border theme-calc" data-theme={t}
                        onclick={() => setDefaultTheme(t)}>
                            {t}
                            <div class="grid grid-cols-3 w-fit h-full ">
                                <div data-tip="primary" class="rounded-full h-8 w-8 tooltip bg-[var(--color-primary)]"></div>
                                <div data-tip="secondary" class="rounded-full h-8 w-8 tooltip bg-[var(--color-secondary)]"></div>
                                <div data-tip="accent" class="rounded-full h-8 w-8 tooltip bg-[var(--color-accent)]"></div>
                                <div data-tip="info" class="rounded-full h-8 w-8 tooltip bg-[var(--color-info)]"></div>
                                <div data-tip="success" class="rounded-full h-8 w-8 tooltip bg-[var(--color-success)]"></div>
                                <div data-tip="error" class="rounded-full h-8 w-8 tooltip bg-[var(--color-error)]"></div>
                            </div>
                        </button>
                    {/each}
                </div>

                <LabelSeparator><h2>Customize</h2></LabelSeparator>
                <div class="flex flex-row p-2 card-base card-100 card-100-border">
                    <div class="grid grid-rows-4 w-full h-full p-2 grid-flow-col">
                        {#each appThemeTypes.RgbaColor as t}
                            <ColorPicker
                                label={$THEME[t].display_name}
                                isAlpha={false}
                                bind:rgb={$THEME[t].value as RgbaColor /*stupid ts*/}
                            />
                        {/each}
                        <div class="flex items-center gap-2">
                            <label class="cursor-pointer flex items-center gap-2 pl-2"><BorderCheckbox bind:checked={$THEME.neo.value} class="checkbox-primary"/>Neo theme?</label> 
                        </div>
                    </div>
                    <div class="flex flex-col p-2 gap-2 w-64">
                        <BorderInput placeholder="Theme name" icon="mingcute:palette-line" class="input-primary"></BorderInput>
                        <button class="btn btn-primary btn-border">Save</button>
                    </div>
                </div>
                
                
            </div>
        </CollapseSetting>
        <CollapseSetting icon="tabler:photo">

        </CollapseSetting>
    </div>
</div>

</div>