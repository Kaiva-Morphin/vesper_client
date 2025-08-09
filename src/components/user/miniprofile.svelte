<script lang="ts">
    import { get_miniprofile, type MiniProfile } from "$lib/api/profile.svelte";
    import Icon from "@iconify/svelte";
    import Avatar from "./avatar.svelte";
    import { applyMiniprofileTheme, DEFAULT_MINIPROFILE_THEME, deserializeMiniprofileTheme, miniprofileThemeToStyle, type MiniprofileTheme } from "$lib/theme/miniprofile.svelte";
    import { tick } from "svelte";
    import { vec2, type Vec2 } from "$lib/window/floating.svelte";
  import { get_profile_cache, refresh_user_miniprofile_cache } from "$lib/globals.svelte";

    let {
        id, 
        user_id, 
        start_edit = null,
        on_size_changed = null
    } : {
        id?: string,
        user_id: string,
        start_edit?: ((initial_theme: MiniprofileTheme | null) => void) | null,
        on_size_changed?: ((size: Vec2) => void) | null
    } = $props();
    let profile = get_profile_cache(user_id);

    
    let theme : MiniprofileTheme = $state(DEFAULT_MINIPROFILE_THEME());

    let style = $state("");

    profile.subscribe(n => {
        if (n && n.miniprofile && n.miniprofile.encoded_theme) {
            theme = deserializeMiniprofileTheme(n.miniprofile.encoded_theme);
            style = miniprofileThemeToStyle(theme);
        }
    })

    refresh_user_miniprofile_cache(user_id);
    // get_miniprofile(user_id).then(
    //     (r) => {
    //         miniprofile = r; 
    //         if (r?.encoded_theme) {
    //             theme = deserializeMiniprofileTheme(r?.encoded_theme)
    //         }
    //         style = miniprofileThemeToStyle(theme);
    //     }
    // );

    

    // svelte-ignore non_reactive_update
    let bg_el : any;
	function handleError() {
		bg_el.poster = "/placeholder.jpg";
	}
    function isVideo(file: string): boolean {
        return /\.(mp4|webm|ogg)$/i.test(file);
    }
    $effect(() => {
        (async () => {
            await tick();
            if (container_el && on_size_changed) {
                const rect = container_el.getBoundingClientRect();
                on_size_changed(vec2(rect.width, rect.height));
            }
        })()
    })
    let container_el : HTMLElement;
</script>



  
<div class="mini-container card-base card-100 flex flex-col" id={id} style={style} bind:this={container_el}>
    {#if !$profile?.miniprofile}
        <div class="w-full absolute h-full my-skeleton"></div>
    {:else}
        {#if $profile?.miniprofile.background == null}
        <div class="mini-bg"></div>
        {:else if isVideo($profile?.miniprofile.background)}
        <video autoplay loop muted playsinline class="mini-bg" poster="" bind:this={bg_el}>
            <source src={$profile?.miniprofile.background} type="video/mp4" class="" onerror={() => {handleError();}}>
        </video>
        {:else}
        <img class="mini-bg" src={$profile?.miniprofile.background} alt="" onerror={(em: any) => {em.currentTarget.src="/placeholder.jpg"}}>
        {/if}
        <div class="mini-header flex flex-row w-full gap-[28px]">
            <!-- <img src="http://localhost:2000/avatar.jpg" class="mini-avatar" alt=""> -->
            <Avatar class="mini-avatar" url={
                {nickname: $profile?.miniprofile.nickname, path: $profile?.miniprofile.avatar}
            }>
            </Avatar>
             <!-- overflow-y-visible -->
            <div class="flex flex-col h-full justify-center pt-[14px] flex-grow max-w-[200px] overflow-ellipsis">
                <div class="text-2xl pr-2 truncate font-bold">{$profile?.miniprofile.nickname}</div>
                <div  class="text-xs font-bold opacity-75 pl-0.5">{$profile?.miniprofile.guid}</div>
                <!-- <div class="flex flex-row gap-1"> -->
                <!-- </div> -->
                <!-- <div class="flex flex-row gap-1">
                    <div  class="text-xs font-bold {!online?"tooltip tooltip-bottom tooltip-primary opacity-75":""}" data-tip="{last_seen_h}">{online?"Online":"Last seen " + last_seen_d}</div>
                </div> -->
            </div>
            {#if start_edit != null}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="w-[28px] h-[28px] cursor-pointer absolute top-3 right-3 mini-edit flex items-center justify-center rounded-full" onclick={() => {start_edit(theme)}} >
                    <Icon class="rounded-full" height=20px icon="mingcute:pencil-line"/>
                </div>
                <!-- <Icon onclick={() => {start_edit(theme)}} class="cursor-pointer absolute top-3 right-3 bg-[var(--bg)] outline-4 outline-[var(--bg)] rounded-full" height=20px icon="mingcute:pencil-line"/> -->
            {/if}
            <!-- <Icon class="absolute top-3 right-11 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:user-follow-2-line"/> -->
            <!-- <Icon class="absolute top-3 right-3 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="tabler:dots"/> -->
            <!-- <Icon class="absolute top-3 right-11 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:user-follow-2-line"/> -->
        </div>
        <!-- <div class="h-[350px]"></div> -->
        <div class="mini-content h-fit flex-grow">

        </div>
    {/if}
</div>


<style>
    :global {
    .mini-header {
        height: 96px;
    }
    .mini-avatar {
        width: 96px;
        height: 96px;
        transform: translate(14px, 14px);
        border-radius: var(--radius-avatar);
        z-index: 100;
        overflow: hidden;
    }
    .mini-edit {
        background: var(--bg);
    }
    .mini-container {
        z-index: 0;
        color: var(--miniprofile-content, #FFFF);
        --radius-avatar: var(--miniprofile-avatar,8px);
        --bg: color-mix(in srgb, var(--color-primary) var(--tint-bg), #0000);
        --bg: linear-gradient(90deg in srgb, 
            color-mix(in srgb, var(--color-primary) var(--tint-bg), #0000),
            color-mix(in srgb, var(--color-secondary) var(--tint-bg), #0000)
        );
        background-color: #000A;
        position: relative;
        z-index: 0; 
        border-radius: var(--border-1);
        overflow: hidden;
        text-shadow: 0px 1px 4px #0007;
        min-height: 120px;

        width: 340px;
        height: fit-content;
        border: 0;

        box-shadow: 0px 1px 12px 1px black;
        border-radius: var(--border-1);
    }
    .mini-content {
        position: relative;
        background: var(--bg);
        backdrop-filter: blur(6px);
        border-top: 1px solid #FFF3;
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }
/* 
    .mini-container::after {
        content: "";
        border-radius: var(--border-1);
        
        z-index: -10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: var(--bi);
        background-size: 100%;
        background-repeat: no-repeat;
        background-clip: 400px;
        mask-image: linear-gradient(to bottom, black, black 400px, transparent 432px);
    } */

    .mini-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-image: var(--bi);
        object-fit: contain;
        object-position: 0px 0px;
        z-index: -10;
        mask-image: linear-gradient(to bottom, black, black 400px, transparent 432px);
    }
    }
</style>