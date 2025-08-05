<script>
  import { page_not_found } from "$lib/path_watcher.svelte";
  import CenteredCard from "../../components/containers/centered_card.svelte";
  import Separator from "../../components/content/separator.svelte";
  import { onDestroy } from 'svelte';
  page_not_found.set(true);
  onDestroy(() => page_not_found.set(false));
</script>



<CenteredCard>
    <strong>PAGE NOT FOUND</strong>
    <Separator></Separator>
</CenteredCard>