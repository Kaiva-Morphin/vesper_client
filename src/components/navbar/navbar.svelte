<script lang="ts">
  import Icon from "@iconify/svelte";
  import NavbarItem from "./item.svelte";
    let unfolded = $state(false);
    function onKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") unfolded = false;
    }
    function clickOutside(node: HTMLElement) {
        function handleClick(e: MouseEvent) {
            if (!node.contains(e.target as Node)) unfolded = false;
        }
        document.addEventListener("click", handleClick);
        return {
            destroy() {
                document.removeEventListener("click", handleClick);
            },
        };
    }
</script>

<div class="bg-green-500 w-[256px] h-full">

</div>
<div class="absolute left-0 top-0 h-full w-0">
    <div
    class="menu h-full z-10 transition-transform duration-300 ease-in-out"
    use:clickOutside
    style="width: 240px; transform: translateX({unfolded ? '0' : '-100%'})"
    >
    <label class="swap swap-rotate absolute top-0 right-[-32px] w-[32px] h-[32px] z-20">
        <input type="checkbox" bind:checked={unfolded}/>
        <Icon class="swap-on" height=32 icon="mingcute:arrows-left-line"></Icon>
        <Icon class="swap-off h-full w-full" height=24 icon="material-symbols:menu-rounded"></Icon>
    </label>
    <NavbarItem link="/" icon="mingcute:home-4-line">Home</NavbarItem>
    <NavbarItem link="/u" icon="mingcute:user-search-line">Users</NavbarItem>
    <NavbarItem link="/calls" icon="tabler:phone">Calls</NavbarItem>
    <NavbarItem link="/social" icon="mingcute:group-3-line">Social</NavbarItem>
    <!-- <HorizontalSeparator gradient/> -->
    <div class="flex-grow"></div>
    <NavbarItem link="/scroll" icon="mingcute:mouse-line">Scroll test</NavbarItem>
    <!-- <HorizontalSeparator gradient/> -->
    <div class="flex-grow"></div>
    <NavbarItem link="/register" icon="mingcute:user-add-2-line">Register</NavbarItem>
    <NavbarItem link="/theme" icon="mingcute:paint-brush-ai-line">Themes</NavbarItem>
    <!-- <HorizontalSeparator gradient/> -->
    <NavbarItem link="/settings" icon="mingcute:settings-1-line">Settings</NavbarItem>
    <NavbarItem link="/about" icon="mingcute:information-line">About</NavbarItem>
</div>
</div>


<style>
    .menu {
        transition-property: transform, width;
        transition-duration: 0.25s;
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    }
</style>