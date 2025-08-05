<script lang="ts">
    import Icon from "@iconify/svelte";
    import CollapseSetting from "../../components/content/collapse_setting.svelte";

    import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
    import { default_themes, appThemeTypes, setDefaultTheme, THEME, serializeTheme, deserializeTheme, setNonOverrideTheme, applyTheme, themeToData, themeToStyle, type AppTheme} from "$lib/theme/app.svelte";
    import { get, type Writable } from "svelte/store";
    import LabelSeparator from "../../components/content/label_separator.svelte";
    import BorderInput from "../../components/content/border_input.svelte";
    import BorderCheckbox from "../../components/content/border_checkbox.svelte";
    import { updated } from "$app/state";
    import Button from "../../components/content/button.svelte";
    import { localState, prettify, shakeById } from "$lib/util.svelte";
  import ThemePreview from "../../components/content/theme_preview.svelte";

    const media_limit = 0.25;
    export const MEDIA_RULE = localState("media_rule_setting", "none");
    
    // theme_name: "eyJuZW8iOnRydWUsInByaW1hcnkiOnsiciI6MTg5LCJnIjoyNTUsImIiOjB9LCJwcmltYXJ5X2NvbnRlbnQiOnsiciI6NjUsImciOjExOCwiYiI6MH0sInNlY29uZGFyeSI6eyJyIjoyMDYsImciOjE5MCwiYiI6MjQ0fSwic2Vjb25kYXJ5X2NvbnRlbnQiOnsiciI6ODYsImciOjcxLCJiIjoxMTd9LCJhY2NlbnQiOnsiciI6ODAsImciOjgwLCJiIjo4MH0sImFjY2VudF9jb250ZW50Ijp7InIiOjI0OCwiZyI6MjQ4LCJiIjoyNDh9LCJpbmZvIjp7InIiOjAsImciOjE4NiwiYiI6MjU0fSwiaW5mb19jb250ZW50Ijp7InIiOjQsImciOjQ2LCJiIjo3M30sInN1Y2Nlc3MiOnsiciI6MSwiZyI6MjIzLCJiIjoxMTR9LCJzdWNjZXNzX2NvbnRlbnQiOnsiciI6MiwiZyI6NDUsImIiOjIwfSwiZXJyb3IiOnsiciI6MjQwLCJnIjo3OCwiYiI6Nzl9LCJlcnJvcl9jb250ZW50Ijp7InIiOjEwNSwiZyI6MCwiYiI6MH0sImJhc2VfY29udGVudCI6eyJyIjoyNTUsImciOjIxNCwiYiI6MTY3fSwidGludF8xMDAiOjEyLCJ0aW50XzIwMCI6MTUsInJhZGl1c19zZWxlY3RvciI6MTIsInJhZGl1c19maWVsZCI6NiwicmFkaXVzX2JveCI6Nn0="
    let themes : Writable<Record<string, string>> = localState("saved_themes", {});
    
    function themeToDataAttrs(theme: AppTheme) {
        return Object.entries(theme)
        .map(([key, value]) => `data-${key}="${value}"`)
        .join(" ");
    }

    let parsed_themes : Record<string, AppTheme> = $state({});


    for (let [key, serialized] of Object.entries($themes)) {
        let theme = deserializeTheme(serialized);
        parsed_themes[key] = theme;
        // parsed_themes[key] = {theme, html : computeThemeHtml(theme)};
    }



    themes.subscribe(() => {
        for (let [key, serialized] of Object.entries($themes)) {
            if (parsed_themes.hasOwnProperty(key)) continue;
            let theme = deserializeTheme(serialized);
            parsed_themes[key] = theme;
        }
    })

    let theme_name = $state("");
    function saveTheme(){
        if (theme_name == "") {
            shakeById("theme_name")
            return;
        }
        $themes[theme_name] = serializeTheme(get(THEME));
        theme_name = "";
    }
    function deleteTheme(name: string){
        delete parsed_themes[name];
        delete $themes[name];
    }

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
                        <ThemePreview 
                        theme={t}
                        onclick={() => {theme_name = prettify(t); setDefaultTheme(t)}}
                        >
                            <Button icon="tabler:trash-bin" class="btn-border btn-primary w-full pr-1">Button</Button>
                            <div class="marker w-15 h-15 btn-border">outer</div>

                        </ThemePreview>
                    {/each}
                </div>  


                <LabelSeparator><h2>Customize</h2></LabelSeparator>
                <div class="flex flex-row p-2 card-base card-100 card-100-border">
                    <div class="grid grid-rows-4 w-full h-full gap-2 grid-flow-col">
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
                        {#each appThemeTypes.px as t}
                            <div class="flex h-full w-full items-center font-semibold">{$THEME[t].display_name}</div>
                            <input type="range" min="0" max="20" class="range" bind:value={$THEME[t].value} />
                        {/each}

                        {#each appThemeTypes.percent as t}
                            <div class="flex h-full w-full items-center font-semibold">{$THEME[t].display_name}</div>
                            <input type="range" min="0" max="20" class="range" bind:value={$THEME[t].value} />
                        {/each}
                    </div>
                </div>
                <div class="flex flex-row p-2 gap-2 w-full">
                    <BorderInput id="theme_name" placeholder="Theme name" icon="mingcute:palette-line" class="flex-grow input-primary" bind:value={theme_name}></BorderInput>
                    <Button icon="mingcute:save-2-line" class="btn btn-primary btn-border pr-2" onclick={saveTheme}>Save Theme</Button>
                    <button onclick={() => {let theme = serializeTheme($THEME);navigator.clipboard.writeText(theme);}} class="tooltip btn btn-border btn-primary" data-tip="Copy to clipboard"><Icon height=24px icon="tabler:copy"/></button>
                    <button onclick={async () => {let theme = deserializeTheme(await navigator.clipboard.readText());setNonOverrideTheme(theme)}} class="tooltip btn btn-border btn-primary hover:btn-error" data-tip="Paste from clipboard"><Icon height=24px icon="tabler:clipboard"/></button>
                </div>
                <LabelSeparator><h2>Your themes</h2></LabelSeparator>
                <div class="grid grid-cols-4 gap-2">
                    {#each Object.entries(parsed_themes) as [key, theme]}
                        <ThemePreview theme={{theme: theme, name: key}}
                        onclick={()=> {setNonOverrideTheme(theme); theme_name = key;}}
                        >
                            <Button icon="tabler:trash" class="btn btn-border btn-error w-full pr-1" onclick={(e : MouseEvent) => {e.preventDefault(); e.stopPropagation(); deleteTheme(key)}}></Button>
                        </ThemePreview>
                    {/each}
                </div>  
            </div>
        </CollapseSetting>
        <CollapseSetting icon="tabler:photo">
            <div slot="title">Images</div>
            <div slot="content">
                <select class="select" bind:value={$MEDIA_RULE}>
                    <option value="none">[max {media_limit}MB] Dont do anything</option>
                    <option value="compress">[max {media_limit}MB] Compress to {media_limit}MB before send</option>
                    <option value="upload">[max 200MB] Upload to catbox (your media will be public) </option>
                </select>
            </div>
        </CollapseSetting>
    </div>
</div>

</div>