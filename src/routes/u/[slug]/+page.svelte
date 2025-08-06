<script lang="ts">
    import Icon from "@iconify/svelte";
    import ProgressiveImage from "../../../components/content/progressive_image.svelte";
    import { PUBLIC_API_BASE } from "$env/static/public";
    import Button from "../../../components/content/button.svelte";
  import { formatTimestamp, timeAgo } from "$lib/util.svelte";
    let nickname = $state("Kaiv");
    let last_seen = Date.now();
    let online = $state(false);
    let last_seen_h = formatTimestamp(last_seen);

    

    let last_seen_d = $state(timeAgo(last_seen - Date.now()));

    let update = async () => {
        const dt = Date.now() - last_seen;
        last_seen_d = timeAgo(dt);
        online = dt < 5000;
        setTimeout(update, 1000)
    }
    update();

    let is_friend : null | boolean = $state(null);
    
</script>


<!-- data-smooth-bg  

data-bg-gradient




null
data-container-gradient
data-container-transparent
data-container-opaque
--blur: 32px
-->

<div 
style=""
data-smooth-bg
data-container-gradient
class="flex-grow flex justify-center relative vh min-w-[900px]">
    <video autoplay loop muted playsinline class="bg-video" poster="/placeholder.jpg">
        <source src="http://localhost:2000/bg.mp4" type="video/mp4" class="">
    </video>
    <!-- <img class="bg-video" src="http://localhost:2000/bg.png" alt=""> -->
    <div class="w-full flex justify-center relative"
    
    >
        <div class="w-full flex flex-col h-fit gap-2 max-w-[900px] p-2 main-container"> 
            <div class="w-full flex flex-col relative">
                <!-- <img src="/placeholder.jpg" class="h-[256px] banner" alt=""> -->
                <div class="flex h-full flex-row gap-[24px] p-[16px] header-container rounded-b-[16px]">
                    <img src="/placeholder.jpg" width="160px" alt="" class="avatar">
                    <div class="flex flex-row w-full h-full justify-between pt-5">

                        <div class="flex flex-col h-full justify-center">
                            <div class="text-3xl font-medium">{nickname}</div>
                            <p>Bio</p>
                        </div>
                        <!-- <div class="w-[256px] pl-2 flex flex-col items-end justify-end wrap gap-2 h-full"> -->
                            
                            <!-- <Button class="btn-primary btn-border hover:btn-success" icon="mingcute:user-add-2-line">Subscribe</Button> -->
                            
                            <!-- <button class="btn btn-primary btn-border hover:btn-error"><Icon height="24px" icon="mingcute:user-remove-2-line"/>Delete</button> -->

                            <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="mingcute:message-4-line"/>Message</button> -->
                            <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="tabler:phone-call"/>Call</button> -->
                            <!-- <button class="btn btn-primary btn-border"><Icon height="24px" icon="mingcute:pencil-line"/>Edit profile</button> -->
                        <!-- </div> -->
                    </div>
                </div>
            </div>
            <div class="w-full gap-2 flex flex-row-reverse flex-wrap h-fit">
                <div class="flex-grow-[0] w-[256px] h-fit card-base card-100 card-100-border flex flex-col p-2 gap-2 top-2 z-10">
                    <div class="font-semibold text-xl {!online?"tooltip tooltip-primary":""}" data-tip="{last_seen_h}">{online?"Online":"Last seen " + last_seen_d}</div>
                    <Button class="btn-primary btn-border" icon="mingcute:user-follow-2-line">Friend</Button>
                    <div class="text-2xl w-full flex flex-row gap-3 items-end"><button class="hover:underline">Friends</button> <div class="text-2xl">32</div></div>
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                        <div class="flex flex-row gap-2 items-center font-semibold">
                            <img src="/placeholder.jpg" width="42px" alt="">
                            Kaiv
                        </div>
                    </div>
                    <Button class="btn-error btn-border" icon="tabler:alert-circle">Report profile</Button>
                </div>

                <div class="flex flex-col h-fit flex-grow gap-2">
                    <div class="flex-grow h-[600px] flex flex-col p-2 gap-2 card-base card-100 card-100-border"></div>
                    <div class="flex-grow h-[600px] flex flex-col p-2 gap-2 card-base card-100 card-100-border"></div>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div class="mini-container card-base card-100 flex flex-col" >
            <!-- style="--bi: url('http://localhost:2000/bg5.gif')" -->
            <video autoplay loop muted playsinline class="mini-bg" poster="/placeholder.jpg">
                <source src="http://localhost:2000/bg2.mp4" type="video/mp4" class="">
            </video>
            <div class="mini-header flex flex-row w-full gap-[28px]">
                <img src="http://localhost:2000/avatar.jpg" class="mini-avatar" alt="">
                <div class="flex flex-col h-full justify-center pt-[14px] flex-grow  overflow-y-visible">
                    <div class="text-2xl pr-2 truncate font-bold">{nickname}</div>
                    <div class="flex flex-row gap-1">
                        <div  class="text-xs font-bold {!online?"tooltip tooltip-bottom tooltip-primary opacity-75":""}" data-tip="{last_seen_h}">{online?"Online":"Last seen " + last_seen_d}</div>
                    </div>
                </div>
                <Icon class="absolute top-3 right-3 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="tabler:dots"/>
                <Icon class="absolute top-3 right-11 bg-[#0004] outline-4 outline-[#0004] rounded-full" height=20px icon="mingcute:user-follow-2-line"/>
            </div>
            <div class="mini-content h-fit flex-grow">
            </div>
        </div>
    </div>
</div>
<div class="sidebar_mirror_alloc"></div>

<style>
    .card-100 {
        /* backdrop-filter: blur(12px); */
        text-shadow: 0px 1px 4px #0007;
    }
    
    .tooltip::before {
        backdrop-filter: none;
        text-shadow: none;
    }

    .mini-header {
        height: 96px;
    }

    .mini-avatar {
        width: 96px;
        height: 96px;
        transform: translate(14px, 14px);
        border-radius: 8px;
    }

    .mini-container {
        background-color: var(--tinted-sec-100o);
        position: fixed;
        border-radius: var(--border-1);
        overflow: clip;
        bottom: 3rem;
        right: 2rem;

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
        position: absolute;
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

        /* mask-image: radial-gradient(circle at top left, transparent 0%, black 20%, black 80%, transparent 100%); */
        /* mask-composite: intersect; */
        /* -webkit-mask-image: radial-gradient(circle at top left, transparent 0%, black 20%, black 80%, transparent 100%);
        mask-composite: intersect; */
    }
    [data-smooth-bg] .bg-video {
        mask-image: 
            linear-gradient(to top, transparent, black 64px, black),
            linear-gradient(to right, transparent, black 64px, black, black calc(100% - 64px), transparent)
            ;
        mask-composite: intersect;
    }
    [data-black-bg] .bg-video {
        
    }
    .bg-image {
        position: absolute;

        left: 50%;
        transform: translateX(-50%);

        top: 0;
        /* z-index: -10; */
        image-rendering: pixelated;

    }
    .header-container {
        border-top: 0;
    }

    
    [data-container-gradient] .main-container {
        background: linear-gradient(90deg in srgb,
                color-mix(in oklch, var(--color-primary) 20%, #0003), 
                color-mix(in oklch, var(--color-secondary) 20%, #0003));
    }

    [data-container-transparent] .main-container {
        background-color: color-mix(in oklch, var(--color-secondary) 20%, #0003);
    }

    [data-container-opaque] .main-container {
        background-color: var(--tinted-sec-100o);
    }


    .main-container {
        backdrop-filter: blur(var(--blur));
    }

    .card-100 {
        background-color: #0005;
        backdrop-filter: blur(10px);
    }

    .card-200 {
        background-color: #0002;
    }

</style>