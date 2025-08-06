<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from '$app/state';
    

    let oauth_err = page.url.searchParams.get("oauth_err");

    if (oauth_err) {
        newToast(`Oauth: ${oauth_err}`, "btn-error");
    }

   

    import { clearRefresh, refresh } from "$lib/api/auth.svelte";
    import { newToast } from "$lib/toast.svelte";
    import Icon from "@iconify/svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { writable } from "svelte/store";
    import { latest_page } from "$lib/path_watcher.svelte";
    let loading = $state(true);
    (async () => {
        if (await refresh()){
            console.log("[AUTH] Access token successfully obtained!");
            // goto($latest_page);
        } else {
            // todo! check for a response status. if service is unavailable, show an err 
            // console.log("[AUTH] Can't get access token, logging out!")
            // clearRefresh();
            // goto("/login");
        }
        loading = false;
    })();

</script>
{#if loading}
<div class="flex items-center justify-center absolute z-100 w-full h-full bg-[#000F]"> 
    <div class="card-100 flex flex-col items-center h-fit w-fit">
        <Icon icon="eos-icons:hourglass" height="32px"></Icon>
    </div>
</div>
{/if}
<style>

</style>