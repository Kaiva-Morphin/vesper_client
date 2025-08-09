<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import Avatar from '../user/avatar.svelte';
  import { USER_UID } from '$lib/token.svelte';
  import { get_miniprofile, type MiniProfile } from '$lib/api/profile.svelte';

  let {
    private : secured  = false,
    channel_id = '1',
    title = 'Channel aaaaaaaaaaaaaa',
    members = [
      { id: USER_UID, name: 'Avatar 1' },
      { id: '2', name: 'Avatar 2' },
      { id: '3', name: 'Avatar 3' },
      { id: '4', name: 'Avatar 4' },
      { id: '5', name: 'Avatar 5' },
    ],
    onclick=(id: string):void=>{}
  } = $props();

  async function fetchMembers() {
    for (let member of members) {
      // let r = await get_miniprofile(member.id);
    } 
  }

  type member = {
    id: string;
    name: string;
  }

  // let members : member[] = $state([
  //   { id: '1', name: 'Avatar 1' },
  //   { id: '2', name: 'Avatar 2' },
  //   { id: '3', name: 'Avatar 3' },
  //   { id: '4', name: 'Avatar 4' },
  //   { id: '5', name: 'Avatar 5' },
  // ])

  let opened = $state(true);


  const toggle = () => {
    opened = !opened;
  };

  const addAvatar = () => {
    const id = String(Date.now());
    members = [...members, { id, name: `Avatar ${members.length + 1}` }];
  };

  const removeAvatar = () => {
    if (members.length > 0) {
      members = members.slice(0, -1);
    }
  };
  const fly_x = (node: any) => fly(node, {opacity: -1.0, x: -40, duration: 250 });
  const fly_y = (node: any) => fly(node, {opacity: -1.0, y: -40, duration: 250 });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card-200 card-200-border p-0.5 relative">
   <button
    class="h-[38px] w-[32px] absolute right-0 flex items-center justify-center cursor-pointer no-focus"
    tabindex="-1"
    onclick={toggle}
  >
    <Icon
      icon="mdi:chevron-up"
      width="24"
      height="24"
      class="transition-transform hover:text-white active:border-0 hover:scale-130"
      style={opened ? '' : 'transform: rotate(-180deg)'}
    />
  </button>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="flex flex-row items-center max-h-[36px] h-[36px] overflow-hidden relative px-2 gap-2 mr-6 cursor-pointer no-focus"
  onclick={() => onclick(channel_id)}>
      {#if secured}
        <Icon class="min-w-[24px] p-[3px]  -translate-x-[1px]" icon="fa:lock" height=24px/>
      {:else}
        <Icon class="min-w-[24px]" icon="flowbite:volume-up-solid" height=24px/>
      {/if}
      <div class="flex-grow-[1000] text-ellipsis overflow-hidden font-bold">{title}</div>
      <div class="flex-grow-[1] flex-shrink h-full flex flex-row flex-wrap-reverse gap-y-4 p-0.5 gap-0.5 place-content-end oveflow-hidden">
        {#if !opened}
          {#each members as member (member.id)}
            <div transition:fly_y|global>
              <Avatar class="w-8 h-8 hover:scale-105 transition-transform" mini url={{nickname: member.name}} ></Avatar>
            </div>
          {/each}
        {/if}
      </div>
  </div>
  {#if opened}
    <div transition:slide={{ duration: 200 }} class="flex flex-col px-2 pb-2 gap-1 mt-1">
        {#each members as member (member.id)}
          <div transition:slide class="member">
            <div transition:fly_x|global class="flex flex-row gap-1 items-center font-semibold">
              <Avatar class="w-8 h-8 hover:scale-105 transition-transform" mini url={{nickname: member.name}} ></Avatar>
              <div>{member.name}</div>
            </div>
          </div>
        {/each}
    </div>
  {/if}
</div>
