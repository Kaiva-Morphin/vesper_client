<script lang="ts">
    import type { Vec2 } from "$lib/window/floating.svelte";
    import { set_window_size } from "$lib/window/floating.svelte";
    import Miniprofile from "../user/miniprofile.svelte";
    let {window_id, user_id} = $props();
    function update_size(size: Vec2) {
        set_window_size(window_id, size);
    }
</script>


<Miniprofile user_id={user_id} on_size_changed={update_size}></Miniprofile>