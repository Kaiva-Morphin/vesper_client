<script lang="ts">
  import Provider from '../../components/window/provider.svelte';

	let { children } = $props();
</script>
<Provider/>
{@render children()}
