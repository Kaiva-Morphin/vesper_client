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
    import { DefaultWindow, openFloating, vec2, type FloatingWindow } from "$lib/window/floating.svelte";
    import AppThemeEditor from "$lib/../components/window/app_theme_editor.svelte";
    import { logout } from "$lib/api/auth.svelte";
    import Miniprofile from "../../components/user/miniprofile.svelte";
    import MiniprofileEditor from "../../components/window/miniprofile.svelte";
    import { USER_UID } from "$lib/token.svelte";
    import Separator from "../../components/content/separator.svelte";
    import Popup from "../../components/popup.svelte";
    import { type MiniprofileTheme } from "$lib/theme/miniprofile.svelte";

    const media_limit = 0.25;
    export const MEDIA_RULE = localState("media_rule_setting", "none");
    
    let themes : Writable<Record<string, string>> = localState("saved_themes", {});
    
    let parsed_themes : Record<string, AppTheme> = $state({});


    for (let [key, serialized] of Object.entries($themes)) {
        let theme = deserializeTheme(serialized);
        parsed_themes[key] = theme;
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


    function openPicker(){
        openFloating({
            ...DefaultWindow,
            component: AppThemeEditor,
            min_size: vec2(265, 400),
            size: vec2(265, 400),
            id: "theme_editor",
            props: {
                id: "theme_editor",
            }
        } as FloatingWindow);        
    }
    type PopupEdit = 'bg' | 'avatar' | 'nickname';
    const MINIPROFILE_PREVIEW = "miniprofile_preview";
    let popup : PopupEdit | null = $state(null);
    const start_edit_miniprofile : (initial_theme: MiniprofileTheme | null) => void = (initial_theme: MiniprofileTheme | null) => {
        openFloating({
            ...DefaultWindow,
            component: MiniprofileEditor,
            min_size: vec2(265, 400),
            size: vec2(265, 400),
            id: "miniprofile_editor",
            props: {
                id: "miniprofile_editor",
                initial_theme: initial_theme,
                em_id: MINIPROFILE_PREVIEW
            }
        } as FloatingWindow); 
    };
</script>


<div 
style=""
class="flex-grow flex justify-center relative vh min-w-[900px] p-2"
>


{#if popup}
  <Popup on_deny={() => {popup = null}} class="absolute">
    <strong class="text-center flex items-center">Drop media!</strong>
    <Separator/>
    <div class="flex flex-row gap-2">
        <button class="btn btn-primary" onclick={() => {popup = null}}>Choose file</button>
    </div>
</Popup>
{/if}

<div class="w-full flex justify-center relative">
    <div class="w-full flex flex-col h-fit max-w-[900px] p-2 card-base card-100 card-100-border gap-2">
        {#if $USER_UID != null}
        <CollapseSetting icon="mingcute:user-3-line" open>
            <div slot="title">Account</div>
            <div slot="content">
                <button class="btn w-full btn-error" onclick={()=> {logout();}}>Log out</button>
                <Miniprofile 
                user_id={$USER_UID} 
                id={MINIPROFILE_PREVIEW}
                start_edit={start_edit_miniprofile}/>
            </div>
        </CollapseSetting>
        {/if}


        <CollapseSetting icon="mingcute:paint-brush-ai-line" open>
            <!-- TODO: ACTIVE STYLE -->
            <div slot="title">Theme</div>
            <div slot="content" class="dark-picker h-fit flex flex-col gap-2 bg-[var(--tinted-sec-200o)]">
                <LabelSeparator><h2>Customize</h2></LabelSeparator>
                <div class="flex flex-row p-2 card-base card-100 card-100-border">
                    <div class="grid grid-rows-4 w-full h-full gap-2 grid-flow-col no-alpha">
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
                    <button onclick={async () => {let theme = deserializeTheme(await navigator.clipboard.readText());setNonOverrideTheme(theme)}} class="z-[1] tooltip tooltip-right btn btn-border btn-primary hover:btn-error" data-tip="Paste from clipboard"><Icon height=24px icon="tabler:clipboard"/></button>
                    <button onclick={() => {let theme = serializeTheme($THEME);navigator.clipboard.writeText(theme);}} class="tooltip btn btn-border btn-primary" data-tip="Copy to clipboard"><Icon height=24px icon="tabler:copy"/></button>
                    <BorderInput id="theme_name" placeholder="Theme name" icon="mingcute:palette-line" class="flex-grow input-primary" bind:value={theme_name}></BorderInput>
                    <Button icon="mingcute:save-2-line" class="btn btn-primary btn-border pr-2" onclick={saveTheme}>Save Theme</Button>
                    <Button icon="mingcute:pin-line" class="btn btn-primary btn-border pr-2" onclick={openPicker}>Unpin picker</Button>
                </div>
                <LabelSeparator><h2>Your themes</h2></LabelSeparator>
                <div class="grid grid-cols-4 gap-2 ">
                    {#each Object.entries(parsed_themes) as [key, theme] (key)}
                        <ThemePreview theme={{theme: theme, name: key}}
                        onclick={()=> {setNonOverrideTheme(theme); theme_name = key;}}
                        >
                        <Button icon="tabler:trash" class="btn btn-border btn-error w-full pr-1" onclick={(e : MouseEvent) => {e.preventDefault(); e.stopPropagation(); deleteTheme(key)}}></Button>
                        </ThemePreview>
                    {/each}
                </div>  
                <LabelSeparator><h2>Default presets</h2></LabelSeparator>
                <div class="grid grid-cols-4 gap-2">
                    {#each default_themes as t}
                        <ThemePreview 
                        theme={t}
                        onclick={() => {theme_name = prettify(t); setDefaultTheme(t)}}
                        >
                            <!-- <Button icon="tabler:trash-bin" class="btn-border btn-primary w-full pr-1">Button</Button> -->
                        </ThemePreview>
                    {/each}
                </div>  

            </div>
        </CollapseSetting>
        <!-- <CollapseSetting icon="tabler:photo">
            <div slot="title">Images</div>
            <div slot="content">
                <select class="select" bind:value={$MEDIA_RULE}>
                    <option value="none">[max {media_limit}MB] Dont do anything</option>
                    <option value="compress">[max {media_limit}MB] Compress to {media_limit}MB before send</option>
                    <option value="upload">[max 200MB] Upload to catbox (your media will be public) </option>
                </select>
            </div>
        </CollapseSetting> -->
    </div>
</div>

</div>