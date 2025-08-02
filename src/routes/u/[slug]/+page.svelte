<script lang="ts">
    import Icon from "@iconify/svelte";
    import ProgressiveImage from "../../../components/content/progressive_image.svelte";
    import { PUBLIC_API_BASE } from "$env/static/public";
    import Button from "../../../components/content/button.svelte";
    let online = $state(false);
    let last_seen = Date.now();
    let last_seen_h = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(last_seen).replace(',', ' at');

    function timeAgo(ms: number) {
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) return `${seconds}s ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;

        const years = Math.floor(months / 12);
        return `${years}y ago`;
    }

    let last_seen_d = $state(timeAgo(last_seen - Date.now()));

    let update = async () => {
        last_seen_d = timeAgo(Date.now() - last_seen);
        setTimeout(update, 1000)
    }
    update();

    let is_friend : null | boolean = $state(null);
    
</script>
    <!-- <div class="w-full h-full card-100">
        <ProgressiveImage 
            class="w-[64px] h-[64px]"
            size={[64, 64]},
            low={`/assets/lowres_3072x4080.jpg`}
            high="/assets/highres.jpg" 
            alt={`/placeholder.jpg`}
        />
    </div>

    <Icon icon="hugeicons:image-not-found-02"></Icon>
     -->




<div class="flex-grow flex justify-center relative vh"

data-circle-avatar
data-smooth-bg
data-bg-gradient

>
    <video autoplay loop muted playsinline class="bg-video" poster="/placeholder.jpg">
        <source src="http://localhost:2000/bg.mp4" type="video/mp4" class="">
        <source src="http://localhost:2000/bg.mp4" type="video/wav" class="">
    </video>
    <!-- <img class="bg-video" src="/placeholder.jpg" alt=""> -->

    <div class="w-full flex justify-center relative" >
        <div class="w-full flex flex-col h-fit gap-2 max-w-[960px]"> 
            <div class="w-full max-h-[512px] flex flex-col relative">
                <img src="/placeholder.jpg" class="h-[256px] banner" alt="">
                <Button class="btn-error btn-border absolute top-2 right-2" icon="tabler:alert-circle" collapsed_opacity=0.5>Report profile</Button>
                <div class="flex flex-row gap-[16px] p-2 card-base card-100 header-container rounded-b-[16px]">
                    <img src="/placeholder.jpg" width="128px" alt="" class="avatar">
                    <div class="w-full">
                        <p class="text-2xl">Name<b>b</b><b>a</b><b>b</b></p>
                        <p>Bio</p>
                    </div>
                    <div class="w-[256px] pl-2 flex flex-col items-end justify-end wrap gap-2 h-full">
                        <strong class="{online?"text-success":"tooltip tooltip-left tooltip-primary"}" data-tip="{last_seen_h}">{online?"Online":"Last seen " + last_seen_d}</strong>
                        
                        <!-- <Button class="btn-primary btn-border hover:btn-success" icon="mingcute:user-add-2-line">Subscribe</Button> -->
                        <button class="btn btn-primary btn-border hover:btn-error"><Icon height="24px" icon="mingcute:user-follow-2-line"/>Friend</button>
                        <!-- <button class="btn btn-primary btn-border hover:btn-error"><Icon height="24px" icon="mingcute:user-remove-2-line"/>Delete</button> -->

                        <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="mingcute:message-4-line"/>Message</button> -->
                        <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="tabler:phone-call"/>Call</button> -->
                        <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="mingcute:pencil-line"/>Edit profile</button> -->
                    </div>
                </div>
            </div>
            <div class="w-full gap-2 flex flex-row-reverse flex-wrap h-fit">
                <div class="flex-grow-[0] w-[256px] h-[256px] card-base card-100 card-100-border flex flex-col p-2 gap-2 sticky top-2">
                    <div class="w-full h-full card-base card-200 card-200-border">
                        <p class="text-2xl w-full flex flex-row place-content-between">Friends 32</p>
                        <div class="flex flex-row gap-2 overflow-hidden">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                            <img src="/placeholder.jpg" class="-mr-5" width="56px" alt="">
                        </div>
                    </div>
                    <div class="w-full card-base card-200 card-200-border h-[100px]"></div>
                    <div class="w-full card-base card-200 card-200-border h-[100px]"></div>
                </div>

                <div class="flex flex-col h-fit flex-grow gap-2">
                    <div class="flex-grow h-[600px] flex flex-col p-2 gap-2 card-base card-100 card-100-border">
                        <div class="w-full h-full card-base card-200 card-200-border"></div>
                    </div>

                    <div class="flex-grow h-[1000px] flex flex-col p-2 gap-2 card-base card-100 card-100-border">
                        <div class="w-full h-full card-base card-200 card-200-border"></div>
                    </div>
                    <div class="flex-grow h-[1000px] flex flex-col p-2 gap-2 card-base card-100 card-100-border">
                        <div class="w-full h-full card-base card-200 card-200-border"></div>
                    </div>
                    <div class="flex-grow h-[1000px] flex flex-col p-2 gap-2 card-base card-100 card-100-border">
                        <div class="w-full h-full card-base card-200 card-200-border"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div data-bg-gradient>
        <div class="mini-container card-base card-100">
            <div class="mini-banner">
                <img class="mini-banner-image" src="http://localhost:2000/animated.gif" alt="">
                <img src="/placeholder.jpg" class="mini-avatar" alt="">
            </div>
            <div class="mini-content px-4 pb-3">
                <strong>Kaiv</strong>
            </div>
        </div>
    </div>

</div>

<style>
    .banner {
        position: relative;
    }
    .banner::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: red;
        /* inset: 0;
        box-shadow:
            inset 0 0 50px 30px black; /* soften all sides */
        pointer-events: none; 
        z-index: 200; /* or higher than video */
    }

    .mini-banner {
        width: 100%;
        position: relative;
        height: 128px;
        margin-bottom: 36px;
        background-color: inherit;
    }
    .mini-banner-image {
        width: 100%;
        height: 100%;
    }
    .mini-avatar {
        z-index: 10;
        position: absolute;
        width: 96px;
        height: 96px;
        top: 50%;
        left: 8px;
        border-radius: 100%;
        border: 6px solid transparent;
        background-color: inherit;
    }
    .mini-container {
        position: absolute;
        border-radius: var(--border-1);
        overflow: clip;
        top: 3rem;
        right: 2rem;

        z-index: 100;
        width: 300px;
        height: fit-content;
    }

    .bg-video {
        position: absolute;
        /* overflow: clip; */
        top: 0;
        z-index: -10;
        min-height: fit-content;
        min-width: fit-content;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;

        /* -webkit-mask-image: radial-gradient(circle at top left, transparent 0%, black 20%, black 80%, transparent 100%);
        mask-image: radial-gradient(circle at top left, transparent 0%, black 20%, black 80%, transparent 100%);
        mask-composite: intersect; */
    }
    [data-smooth-bg] .bg-video {
        mask-image: linear-gradient(to top, transparent, black 64px, black);
    }

    

    .bg-image {
        position: absolute;

        left: 50%;
        transform: translateX(-50%);

        top: 0;
        /* z-index: -10; */
        image-rendering: pixelated;

    }

    .avatar {
        border-radius: var(--border-2);
        /* border: inherit; */
    }
    [data-circle-avatar] .avatar { 
        border-radius: 100%;
    }

    .header-container {
        border-top: 0;
    }
    [data-circle-avatar] .header-container {
        border-bottom-left-radius: 72px;
    }

    [data-bg-gradient] .card-100 {
        background: var(--bg-100);
        /* background: linear-gradient(105deg, 
                color-mix(in oklab, var(--color-primary) 20%, #1112), 
                color-mix(in oklab, var(--color-secondary) 20%, #1112)); */
        background-origin: border-box;
    }
    [data-bg-secondary] .card-100 {
        background-color: color-mix(in srgb, var(--color-secondary) 20%, #0003);
        background-origin: border-box;
    }
    [data-bg-primary] .card-100 {
        background-color: color-mix(in srgb, var(--color-primary) 20%, #0003);
        background-origin: border-box;
    }
    [data-bg-gradient] .card-200 {
        background: linear-gradient(105deg, 
                color-mix(in oklab, var(--color-primary) 4%, #3332), 
                color-mix(in oklab, var(--color-secondary) 4%, #3332));
        /* background: color-mix(in srgb, transparent 70%, #222); */
        mix-blend-mode: lighten;
        background-origin: border-box;
    }
    [data-bg-secondary] .card-200 {
        background-color: color-mix(in oklch, var(--color-secondary) 6%, #0002);
        background-origin: border-box;
    }
    [data-bg-primary] .card-200 {
        background-color: color-mix(in oklch, var(--color-primary) 6%, #0002);
        background-origin: border-box;
    }
</style>