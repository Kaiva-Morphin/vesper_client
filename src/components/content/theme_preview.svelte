<script lang="ts">
    import { setDefaultTheme, setNonOverrideTheme, themeToData, themeToStyle, type AppTheme } from "$lib/theme/app.svelte";
    import { prettify } from "$lib/util.svelte";
  import Button from "./button.svelte";
    let {
        theme,
        onclick,
        neo_override,
    } : {
        neo_override?: boolean,
        onclick?: (e: MouseEvent) => void,
        theme : string | {theme: AppTheme, name: string},
    }= $props();
    let data = typeof theme == "string" ? {} : themeToData(theme.theme);
    let data_neo = data["neo"];
    let neo = 
    neo_override != null ? neo_override :
    typeof theme == "string" ? !theme.includes("simple") : data_neo ? data_neo : "true";
    let theme_data = typeof theme == "string" ? theme : theme.theme;
    let theme_name = typeof theme == "string" ? prettify(theme) : theme.name;
    let style = typeof theme == "string" ? "" : themeToStyle(theme.theme);
</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="w-full h-fit flex gap-2 flex-row-reverse items-center justify-between p-2 pl-3 font-bold card-base card-100 card-100-border theme-calc text-md cursor-pointer overflow-clip" 
    data-theme={typeof theme == "string" ? theme : ""}
    data-neo={neo}
    style={style}
    onclick={onclick}>
    
    <div class="grid grid-cols-3 min-w-fit h-full gap-0.5">
        <div data-tip="primary" class="rounded-full h-6 w-6 tooltip bg-[var(--color-primary)]"></div>
        <div data-tip="secondary" class="rounded-full h-6 w-6 tooltip bg-[var(--color-secondary)]"></div>
        <div data-tip="accent" class="rounded-full h-6 w-6 tooltip bg-[var(--color-accent)]"></div>
        <div data-tip="info" class="rounded-full h-6 w-6 tooltip bg-[var(--color-info)]"></div>
        <div data-tip="success" class="rounded-full h-6 w-6 tooltip bg-[var(--color-success)]"></div>
        <div data-tip="error" class="rounded-full h-6 w-6 tooltip bg-[var(--color-error)]"></div>
    </div>
    <div class="flex flex-col  gap-2 items-center">
        {theme_name}
        <slot></slot>
    </div>
</div>
