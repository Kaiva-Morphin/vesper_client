<script lang="ts">
  import Icon from "@iconify/svelte";
  import CenteredCard from "../../components/containers/centered_card.svelte";
  import BorderInput from "../../components/content/border_input.svelte";
  import LabelSeparator from "../../components/content/label_separator.svelte";
  import Separator from "../../components/content/separator.svelte";
  import Turnstile from "../../components/content/turnstile.svelte";
  import Popup from "../../components/popup.svelte";
  import { setAccess } from "$lib/token.svelte";
  import { newToast } from "$lib/toast.svelte";
  import { login } from "$lib/api/auth.svelte";
  import { shakeById } from "$lib/util.svelte";

  let popup_callback : null | ((token: string) => void) = $state(null);
  let process_popup : boolean = $state(false);
  let email = $state("");
  let password = $state("");
  function loginPressed() {
    popup_callback = (token: string) => {
      (async () => {
        popup_callback = null;
        process_popup = true;
        let r = await login(token, email, password);
        if (typeof r === "string") {
          if (r.includes("Incorrect")) {
            shakeById("email");
            shakeById("password");
          }
          newToast(r, "btn-error");
        } else {
          setAccess(r);
          newToast("Welcome to Vesper!", "btn-success");
        }
        process_popup = false;
      })()
    };
  }
</script>

{#if popup_callback}
<Popup on_deny={() => {popup_callback = null}}>
  <strong class="text-center">To continue pass the challenge:</strong>
  <Separator/>
  <Turnstile callback={popup_callback}/>
</Popup>
{/if}

{#if process_popup}
<Popup on_deny={() => {}}>
  <strong class="text-center flex items-center">Processing...<Icon class="pl-2" height="24px" icon="svg-spinners:gooey-balls-2"></Icon></strong>
  <Separator/>
</Popup>
{/if}

<CenteredCard>
  <strong class="text-center text-2xl">Welcome back!</strong>
  <div class="horizontal_separator min-w-[256px] "></div>
    <BorderInput id="email" bind:value={email} autocomplete="email" icon="mingcute:inbox-2-line" placeholder="Email"/>
    <BorderInput onsubmit={loginPressed} id="password" bind:value={password} autocomplete="new-password" icon="mingcute:key-2-line" password placeholder="Password"/>
  <button class="btn btn-border btn-primary" onclick={loginPressed}><Icon icon="mingcute:enter-door-line" height="22px" class="-ml-2"/>Log in</button>
  <div class="w-full flex flex-row justify-between">
    <a href="password_recovery" class="link link-primary">Forgot password?</a>
    <a href="register" class="link link-primary">Sign up</a>
  </div>
  <LabelSeparator><strong>OR</strong></LabelSeparator>
  <a href="about" class="btn btn-border btn-primary"><Icon icon="ri:google-fill" height="22px" class="-ml-2"/>Google</a>
  <a href="about" class="btn btn-border btn-primary"><Icon icon="ri:discord-fill" height="22px" class="-ml-2"/>Discord</a>
</CenteredCard>