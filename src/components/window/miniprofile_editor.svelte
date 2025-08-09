<script lang="ts">
    import Icon from "@iconify/svelte";
    import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
    import { appThemeTypes, THEME} from "$lib/theme/app.svelte";
    import BorderCheckbox from "../content/border_checkbox.svelte";
    import { easeOutQuint, sleep } from "$lib/util.svelte";
    import { closeFloating } from "$lib/window/floating.svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { applyMiniprofileTheme, DEFAULT_MINIPROFILE_THEME, miniprofileThemeTypes, serializeMiniprofileTheme, type MiniprofileTheme } from "$lib/theme/miniprofile.svelte";
    import { get, writable, type Writable } from "svelte/store";
    import { CssStyleProperty } from "$lib/theme/abstraction.svelte";
    import LabelSeparator from "../content/label_separator.svelte";
    import Button from "../content/button.svelte";
    import { set_avatar, set_miniprofile_bg, set_miniprofile_theme, set_nickname } from "$lib/api/profile.svelte";
    import { newToast } from "$lib/toast.svelte";
    import BorderInput from "../content/border_input.svelte";
    import { Svrollbar } from "svrollbar";

    let {
        id,
        em_id,
        initial_theme,
        onclose,
        refresh_preview = () => {},
    } : {
        id : string,
        em_id: string,
        initial_theme: MiniprofileTheme | null,
        onclose? : (() => void),
        refresh_preview? : (() => void)
    } = $props()

    let theme = initial_theme ?? DEFAULT_MINIPROFILE_THEME();

    let EDITABLE_MINIPROFILE : Writable<MiniprofileTheme> = writable(theme);

    EDITABLE_MINIPROFILE.subscribe(theme => {
        let em = document.getElementById(em_id);
        if (em) applyMiniprofileTheme(theme, em);
    });
    let viewport;
    let contents;



    let avatar_input: HTMLInputElement;
    let bg_input: HTMLInputElement;

    let avatar_loading = $state(false);
    async function handleAvatarChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            avatar_loading = true;            
            let e = await set_avatar(file);
            if (!e) {
                await sleep(100);
                refresh_preview();
                newToast("Avatar saved!", "btn-success");
            } else {
                newToast(e.toString(), "btn-error");
            }
            avatar_loading = false;
        }
    }

    let background_loading = $state(false);
    async function handleBgChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            background_loading = true;
            let e = await set_miniprofile_bg(file);
            if (!e) {
                await sleep(100);
                refresh_preview();
                newToast("Background saved!", "btn-success");
            } else {
                newToast(e.toString(), "btn-error");
            }
            background_loading = false;
        }
    }
    let nickname = $state("");
</script>

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
        <button class="pr-2 cursor-pointer"><Icon icon="mingcute:close-fill" class="hover:text-gray-500" onclick={() => {if (onclose) onclose();closeFloating(id)}}/></button>
        <div class="w-full absolute bottom-0 horizontal_separator "></div>
    </div>
    <div class="w-full flex-grow cursor-auto bg-inherit">
        <div bind:this={viewport} class="viewport w-full h-full overflow-y-scroll bg-inherit">
            <!-- dont ask about h-[1px], idk -->

             <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div bind:this={contents} class="flex flex-col h-[1px] gap-2 p-2 pt-4
                    no-alpha  dark-picker bg-inherit"
                >
                <BorderInput placeholder="Nickname" class="" bind:value={nickname}></BorderInput>
                <Button class="btn btn-border btn-primary" icon="ph:feather-bold" request onclick={async () => {
                    let ok = await set_nickname(nickname);
                    newToast(ok ? "Saved!" : "Something went wrong", ok ? "btn-success" : "btn-error");
                    if (ok) {
                        refresh_preview();
                    }
                }}>Save</Button>
                <LabelSeparator>Avatar</LabelSeparator>

                <Button
                    loading={avatar_loading}
                    icon="mingcute:user-4-line"
                    class="btn btn-border btn-primary"
                    onclick={() => avatar_input.click()}
                >
                    Change avatar
                    <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        bind:this={avatar_input}
                        onchange={handleAvatarChange}
                    />
                </Button>

                <LabelSeparator>Background</LabelSeparator>
                <Button
                    loading={background_loading}
                    icon="mingcute:pic-ai-fill"
                    class="btn btn-border btn-primary"
                    onclick={() => bg_input.click()}
                >
                    Change background
                    <input
                        type="file"
                        accept="image/*,video/*"
                        class="hidden"
                        bind:this={bg_input}
                        onchange={handleBgChange}
                    />
                </Button>

                <LabelSeparator>Theme</LabelSeparator>
                {#each miniprofileThemeTypes.rgba as t}
                    <ColorPicker
                        label={$EDITABLE_MINIPROFILE[t].display_name}
                        isAlpha={false}
                        bind:rgb={$EDITABLE_MINIPROFILE[t].value as RgbaColor}
                    />
                {/each}
                {#each miniprofileThemeTypes.px as t}
                    <div class="flex items-center font-semibold">{$EDITABLE_MINIPROFILE[t].display_name}</div>
                    <input type="range" min={$EDITABLE_MINIPROFILE[t].min as number} max={$EDITABLE_MINIPROFILE[t].max as number} class="min-h-[24px] range w-full" bind:value={$EDITABLE_MINIPROFILE[t].value} />
                {/each}

                {#each miniprofileThemeTypes.percent as t}
                    <div class="flex items-center font-semibold">{$EDITABLE_MINIPROFILE[t].display_name}</div>
                    <input type="range" min={$EDITABLE_MINIPROFILE[t].min as number} max={$EDITABLE_MINIPROFILE[t].max as number} class="min-h-[24px] range w-full" bind:value={$EDITABLE_MINIPROFILE[t].value} />
                {/each}
                <Button class="btn btn-border btn-primary" icon="mingcute:save-2-line" request onclick={async () => {
                    let ok = await set_miniprofile_theme(serializeMiniprofileTheme(get(EDITABLE_MINIPROFILE)));
                    newToast(ok ? "Saved!" : "Something went wrong", ok ? "btn-success" : "btn-error");
                }}>Save</Button>
            </div>
        </div>
        <!-- <Svrollbar {viewport} {contents} /> -->
    </div>
</div>
