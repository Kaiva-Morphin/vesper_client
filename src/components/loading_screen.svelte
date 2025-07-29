<script lang="ts">
  import { goto } from "$app/navigation";
  import { clearRefresh, refresh } from "$lib/api/auth.svelte";
    import Icon from "@iconify/svelte";
    import { fade, fly, slide } from "svelte/transition";
    let loading = $state(true);
    (async () => {
        if (await refresh()){
            console.log("[AUTH] Access token successfully obtained!");
            // goto("/login");
        } else {
            console.log("[AUTH] Can't get access token, logging out!")
            clearRefresh();
            goto("/login");
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