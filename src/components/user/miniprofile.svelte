<script lang="ts">
    import { get_miniprofile, type MiniProfile } from "$lib/api/profile.svelte";
    import Icon from "@iconify/svelte";

    import Avatar from "./avatar.svelte";
    import { applyMiniprofileTheme, DEFAULT_MINIPROFILE_THEME, deserializeMiniprofileTheme, type MiniprofileTheme } from "$lib/theme/miniprofile.svelte";

    let {id, user_id, start_edit = null} : {
        id: string,
        user_id: string,
        start_edit?: ((initial_theme: MiniprofileTheme | null) => void) | null,
    } = $props();
    let miniprofile : MiniProfile | null = $state(null);
    let theme : MiniprofileTheme = $state(DEFAULT_MINIPROFILE_THEME);
    get_miniprofile(user_id).then(
        (r) => {
            miniprofile = r; 
            if (r?.encoded_theme) {
                theme = deserializeMiniprofileTheme(r?.encoded_theme)
                let em = document.getElementById(id);
                if (em) {
                    applyMiniprofileTheme(theme, em);
                }
            }
        }
    );
    // svelte-ignore non_reactive_update
    let bg_el : any;
	function handleError() {
		bg_el.poster = "/placeholder.jpg";
	}
</script>



  
<div class="mini-container card-base card-100 flex flex-col" id={id}>
    {#if !miniprofile}
        <div class="w-full absolute h-full my-skeleton bg-red-500"></div>
    {:else}
        <video autoplay loop muted playsinline class="mini-bg" poster="" bind:this={bg_el}>
            <source src={miniprofile.background} type="video/mp4" class="" onerror={() => {handleError();}}>
        </video>
        <img class="mini-bg" src={miniprofile.background} alt="" onerror={(em: any) => {em.currentTarget.src="/placeholder.jpg"}}>
        
        <div class="mini-header flex flex-row w-full gap-[28px]">
            <!-- <img src="http://localhost:2000/avatar.jpg" class="mini-avatar" alt=""> -->
            <Avatar class="mini-avatar" url={
                {nickname: miniprofile.nickname, path: miniprofile.avatar}
            }>
            </Avatar>
            <div class="flex flex-col h-full justify-center pt-[14px] flex-grow  overflow-y-visible">
                <div class="text-2xl pr-2 truncate font-bold">{miniprofile.nickname}</div>
                <div  class="text-xs font-bold opacity-75">{miniprofile.uid}</div>
                <!-- <div class="flex flex-row gap-1"> -->
                <!-- </div> -->
                <!-- <div class="flex flex-row gap-1">
                    <div  class="text-xs font-bold {!online?"tooltip tooltip-bottom tooltip-primary opacity-75":""}" data-tip="{last_seen_h}">{online?"Online":"Last seen " + last_seen_d}</div>
                </div> -->
            </div>
            {#if start_edit != null}
                <Icon onclick={() => {start_edit(theme)}} class="cursor-pointer absolute top-3 right-3 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:pencil-line"/>
            {/if}
            <!-- <Icon class="absolute top-3 right-11 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:user-follow-2-line"/> -->
            <!-- <Icon class="absolute top-3 right-3 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="tabler:dots"/> -->
            <!-- <Icon class="absolute top-3 right-11 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:user-follow-2-line"/> -->
        </div>
        <div class="mini-content h-fit flex-grow">
        </div>
    {/if}
</div>


<style>
    .mini-header {
        height: 96px;
    }

    :global {
        .mini-avatar {
            width: 96px;
            height: 96px;
            transform: translate(14px, 14px);
            border-radius: 8px;
        }
    }
    .mini-container {
        --a: #0004;
        --text: #FFFF;
        color: var(--text);

        background-color: #000A;
        position: relative;
        z-index: 0; 
        border-radius: var(--border-1);
        overflow: clip;
        text-shadow: 0px 1px 4px #0007;
        min-height: 120px;

        width: 340px;
        height: fit-content;
        border: 0;
        box-shadow: 0px 1px 12px 1px black;
    }
    .mini-content {
        background: #000A;
        border-top: 1px solid #FFF3;
    }

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
    }
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
</style>