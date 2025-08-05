<script lang="ts">
  let {class : extra_class = "", checked = $bindable()} : {class? : string, checked : boolean} = $props();
</script>
<input bind:checked={checked} type="checkbox" class={`checkbox checkbox-border ${extra_class}`} />
<style>
:global{
[data-neo="true"] .checkbox-border {
  border: none;
  --col: var(--input-color, color-mix(in oklab, var(--color-base-content) 20%, #0000));
  outline-color: var(--col);
  outline-style: solid;
  --size: calc(var(--size-selector, 0.25rem) * 6 - var(--border) * 2);
  width: var(--size);
  height: var(--size);
  outline-width: var(--border); 
  transition-property: color, background-color, outline-color, outline-width, outline-offset, outline-color, transform;
  transition-duration: 0.15s;
  outline-offset: 0px;  
  border-radius: var(--radius-field);
}
[data-neo="true"] .checkbox-border:hover, [data-neo="true"] .checkbox-border:focus-visible {
  outline-offset: var(--border);
  background-color: var(--col);
}
[data-neo="true"] .checkbox-border:active {
  outline-offset: -2px;
  scale: 0.97;
  outline-color: var(--col);
  background-color: var(--col);
}
[data-neo="true"] .checkbox {
  background-color: transparent;
}
[data-neo="true"] .checkbox::before {
  background-color: var(--tinted-sec-100o);
}
[data-neo="true"] .checkbox:checked::before {
  background-color: var(--col);
}
[data-neo="true"] .checkbox:checked:hover::before, [data-neo="true"] .checkbox-border:focus-visible::before, [data-neo="true"] .checkbox:checked:active::before {
  background-color: var(--tinted-sec-100o);
}
}
</style>