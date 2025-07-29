<script lang="ts">
    import Icon from "@iconify/svelte";
    type Props = {
        link: string;
        icon: string;
    };

    let { link, icon }: Props = $props(); 
    import { page } from '$app/state';
</script>

<a href={link} class={`relative btn btn-primary gap-2 flex flex-row navbar_button ${page.url.pathname.startsWith(link) ? "active_navbar_button" : "btn-ghost"}`}>
    <Icon icon={icon} height=24px class="min-w-[24px] shd"/>
    <slot></slot>
</a>

<style>


:global {
    .navbar_button {
        overflow: hidden;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        min-height: 40px;
        line-height: 1rem;
        padding: 2px 2px 2px 8px;
        align-items: center;
        justify-content: start;
        overflow: hidden;
        border: 0;
    }


    [data-neo] .navbar_button  {
        /* border: 2px solid transparent; */
        /* padding: 2px; */
        padding: 2px 2px 2px 8px;
        border-radius: var(--radius-field);
        color: color-mix(in srgb, var(--color-primary) var(--tint-200), #FFF);
        transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        transition-property: transform;
        transition-duration: 0.15s;
        background: none;
    }
    
    [data-neo] path {
        box-shadow: 0px 0px 4px 2px color-mix(in srgb, var(--color-secondary) 100%, #0000);
    }

    [data-neo] .navbar_button:hover, [data-neo] .active_navbar_button {
        color: #FFF;
        color: var(--tinted-acc-100);
        /* border: 2px solid var(--tinted-sec-100); */
        box-shadow: inset 0px 0px 4px 2px color-mix(in srgb, var(--color-secondary) 20%, #0000);
        background-origin: border-box;
        background-image: var(--bg-100);
    }

    .active_navbar_button:hover, .active_navbar_button:active {
        border: 0;
    }
    [data-neo] .active_navbar_button:hover, [data-neo] .navbar_button:active, [data-neo] .active_navbar_button:active {
        color: #FFF;
        /* border: 2px solid var(--tinted-sec-100); */
        box-shadow: inset 0px 0px 4px 2px color-mix(in srgb, var(--color-secondary) 34%, #0000);
        background-image: var(--bg-200);
    }
    .navbar_button:active, .active_navbar_button:active {
        border: 0;
    }
    [data-neo] .navbar_button:active, [data-neo] .active_navbar_button:active {
        translate: unset;
        transform: scale(0.97);
    }
}
</style>