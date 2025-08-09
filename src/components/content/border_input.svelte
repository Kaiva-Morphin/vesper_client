<script lang="ts">
  import Icon from "@iconify/svelte";
    let {
        value = $bindable(),
        id = null,
        placeholder = "",
        icon = null,
        class: extra_class = "",
        password = false,
        autocomplete = null,
        style: style_prop = "",
        ok_state = null,
        err_hint = null,
        onsubmit = null,
    } = $props();
    let hidden = $state(password ? true : false);
</script>

<label data-tip={err_hint??""}
id={id}
class={`flex-inline flex custom_input ${extra_class} ${ok_state == false && err_hint ? "tooltip tooltip-error" : ""}`} style={ok_state == null ? "" : ok_state ? "--col: var(--color-success); --col-active: var(--col)" : "--col: var(--color-error); --col-active: var(--col)"}>
    {#if icon != null}
        <Icon icon={icon} height=22px class="ml-2 min-w-[22px] max-w-full h-full"></Icon>
    {/if}
    <input  bind:value={value} class="inner_input unselectable flex-grow mx-2" data-password type={hidden ? "password" : "text"} autocomplete={autocomplete} placeholder={placeholder}/>
    {#if password}
        <label class="swap swap-flip-vertical cursor-pointer">
            <input type="checkbox" tabindex='-1' onclick={() => {hidden = !hidden}}/>
            <Icon class="swap-on h-full mr-2" height=22px icon="mingcute:eye-2-fill"></Icon>
            <Icon class="swap-off h-full mr-2" height=22px icon="mingcute:eye-close-fill"></Icon>
        </label>
    {/if}
</label>

<style>
input:not(:placeholder-shown) {
  transition: letter-spacing 0.3s, font-family 0.3s;
}

:focus {
    outline: 0;
}

input[type="password"]:not(:placeholder-shown) {
  font-family: Verdana;
  letter-spacing: 0.125em;
}


.inner_input {
    width: 0;
}

.custom_input {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-wrap: nowrap;
    cursor: text;
    --col: color-mix(in srgb, var(--color-base-content) 20%, #0000);
    --col-active: color-mix(in srgb, var(--color-base-content) 40%, #0000);
    --size: calc(var(--size-field, 0.25rem) * 10);
    height: var(--size);
    padding-block: var(--size-field);
    border-radius: var(--radius-field);
    border: 2px solid var(--col);
    background-origin: border-box;
}

.custom_input:has(.inner_input:focus) {
    border-color: var(--col-active);
}

</style>