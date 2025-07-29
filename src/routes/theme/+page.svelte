<script lang="ts">
  import { setThemeOverrideStyle, switchTheme } from "$lib/theme.svelte";

  function change(event: Event) {
    event.preventDefault();
    switchTheme();
  }

  const t = "color-scheme: dark;     --color-base-100: oklch(20.768% 0.039 265.754);  --color-base-200: oklch(19.314% 0.037 265.754);  --color-base-300: oklch(17.86% 0.034 265.754);  --color-base-content: oklch(84.153% 0.007 265.754);  --color-primary: oklch(75.351% 0.138 232.661);  --color-primary-content: oklch(15.07% 0.027 232.661);  --color-secondary: oklch(68.011% 0.158 276.934);  --color-secondary-content: oklch(13.602% 0.031 276.934);  --color-accent: oklch(72.36% 0.176 350.048);  --color-accent-content: oklch(14.472% 0.035 350.048);  --color-neutral: oklch(27.949% 0.036 260.03);  --color-neutral-content: oklch(85.589% 0.007 260.03);  --color-info: oklch(68.455% 0.148 237.251);  --color-info-content: oklch(0% 0 0);  --color-success: oklch(78.452% 0.132 181.911);  --color-success-content: oklch(15.69% 0.026 181.911);  --color-warning: oklch(83.242% 0.139 82.95);  --color-warning-content: oklch(16.648% 0.027 82.95);  --color-error: oklch(71.785% 0.17 13.118);  --color-error-content: oklch(14.357% 0.034 13.118);  --radius-selector: 1rem;  --radius-field: 0.5rem;  --radius-box: 1rem;  --size-selector: 0.25rem;  --size-field: 0.25rem;  --border: 2px;  --depth: 0;  --noise: 0;"

  let overridden = $state(false);
  function override(event: Event) {
      event.preventDefault();
      overridden = !overridden;
      setThemeOverrideStyle(overridden ? t : "");
  }

</script>

<div class="card-100 flex-grow h-full flex flex-col">
  <div>
    <button class="btn btn-error btn-border" onclick={override}>OVERRIDE THEME</button>
  </div>
  <div>
    <button class="btn btn-error" onclick={change}>SWITCH THEME</button>
  </div>
  


  <button class="btn btn-primary btn-border">primary button</button>
  <button class="btn btn-secondary btn-border">secondary button</button>
  <button class="btn btn-accent btn-border">accent button</button>
  <button class="btn btn-info">i button</button>
  <button class="btn btn-border btn-info">bi button</button>
  <button class="btn btn-info btn-disabled">disabled i button</button>
  <button class="btn btn-border btn-info btn-disabled">disabled bi button</button>
  <button class="btn btn-error">e button</button>
  <button class="btn btn-error btn-border">be button</button>
  <button class="btn btn-error btn-disabled">disabled e button</button>
  <button class="btn btn-border btn-error btn-disabled">disabled be button</button>
  <button class="btn btn-warning">w button</button>
  <button class="btn btn-warning btn-border">bw button</button>
  <button class="btn btn-warning btn-disabled">disabled w button</button>
  <button class="btn btn-border btn-warning btn-disabled">disabled bw button</button>
</div>

<style>

:root {
  /* font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; */
  /* font-weight: 500; */
  /* font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; */
  /* font-family: Space Grotesk,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji; */
  /* font-family: Inter, Avenir, Helvetica, Arial, sans-serif; */
  /* font-size: 16px; */
  /* line-height: 24px; */
  /* font-weight: 400; */

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

</style>
