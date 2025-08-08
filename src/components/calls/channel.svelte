<script lang="ts">
  import { crossfade, fade } from 'svelte/transition';
  import { onMount } from 'svelte';
    
  let isOpen = false;
  let avatars : { id: string; name: string }[] = [
    { id: "1", name: 'Avatar 1' },
    { id: "2", name: 'Avatar 2' },
    { id: "3", name: 'Avatar 3' },
    { id: "4", name: 'Avatar 4' },
    { id: "5", name: 'Avatar 5' },
  ];

  const [send, receive] = crossfade({
    duration: 300,
  });

  const toggle = () => {
    isOpen = !isOpen;
  };

  let displayedAvatars : { id: string; name: string }[] = [];
  let remainingCount = 0;

  onMount(() => {
    updateDisplayedAvatars();
  });

  function updateDisplayedAvatars() {
    if (isOpen) {
      displayedAvatars = avatars;
    } else {
      remainingCount = avatars.length - 1;
      displayedAvatars = remainingCount > 0 ? [avatars[0], { id: 'more', name: `+${remainingCount}` }] : [avatars[0]];
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<style>
  .collapsible {
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px 0;
  }
  .avatar-list {
    list-style: none;
    padding: 0;
  }
  .avatar {
    display: inline-block;
    margin-right: 5px;
    background: red;
    width: 40px;
    height: 40px
  }
</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="collapsible" on:click={toggle}>
    <div class="header">
        <span class="icon">🔽</span>
        <span class="text">Avatars</span>
        <div class="avatars">
            {#each displayedAvatars as avatar (avatar.id)}
            {#if !isOpen}
                    <div class="avatar" 
                    in:receive={{key: avatar.id}}
                    out:send={{key: avatar.id}}
                    ></div>
                    {/if}
                {/each}
        </div>
  </div>
  <div class="flex flex-col">
      {#each avatars as avatar (avatar.id)}
      {#if isOpen}
                <div class="avatar" 
                in:receive={{key: avatar.id}}
                    out:send={{key: avatar.id}}
                ></div>
                {/if}
            {/each}
    </div>
</div>

