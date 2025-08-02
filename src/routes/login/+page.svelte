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
  import { login, oauth_login } from "$lib/api/auth.svelte";
  import { shakeById } from "$lib/util.svelte";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { goto } from "$app/navigation";

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
  async function oauthHandler(event: MessageEvent<any>) {
    if (event.origin !== window.location.origin) return;
    let err = event.data?.err;
    console.log(event.data);
    if (err) {
      newToast(err, 'btn-error');
      return
    }
    let register_token = event.data?.register;
    if (register_token) {
      newToast(register_token, 'btn-error');
      sessionStorage.setItem("temp_register_token", register_token);
      goto("/register/oauth");
      return
    }
    let login_token = event.data?.login;
    if (login_token) {
      let r = await oauth_login(login_token);
      if (typeof r === "string") {
        newToast(r, "btn-error");
      } else {
        setAccess(r);
        newToast("Welcome to Vesper!", "btn-success");
        goto("/")
      }
      return
    }
  }
  const channel = new BroadcastChannel('oauth_channel');
  channel.onmessage = oauthHandler; 

  function loginWithGoogle() {
    const state = crypto.randomUUID();
    localStorage.setItem('state', state);
    window.open(`/api/auth/google?state=${state}`, "_blank", "popup,width=600,height=500");
  }

  function loginWithDiscord() {
    const state = crypto.randomUUID();
    localStorage.setItem('state', state);
    window.open(`/api/auth/discord?state=${state}`, "_blank", "popup,width=600,height=500");
  }
</script>



<div id="content_container" class="flex-grow flex justify-center">
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
    <div class="brand min-w-[256px]"></div>
    <Separator/>
    <!-- <strong class="text-center text-2xl">Welcome back!</strong> -->
      <BorderInput id="email" bind:value={email} autocomplete="email" icon="mingcute:inbox-2-line" placeholder="Email"/>
      <BorderInput onsubmit={loginPressed} id="password" bind:value={password} autocomplete="new-password" icon="mingcute:key-2-line" password placeholder="Password"/>
    <button class="btn btn-border btn-primary" onclick={loginPressed}><Icon icon="mingcute:enter-door-line" height="22px" class="-ml-2"/>Log in</button>
    <div class="w-full flex flex-row justify-between">
      <a href="password_recovery" class="link link-primary">Forgot password?</a>
      <a href="register" class="link link-primary">Sign up</a>
    </div>
    <LabelSeparator><strong>OR</strong></LabelSeparator>
    <button onclick={loginWithGoogle} class="btn btn-border btn-primary"><Icon icon="ri:google-fill" height="22px" class="-ml-2"/>Google</button>
    <button onclick={loginWithDiscord} class="btn btn-border btn-primary"><Icon icon="ri:discord-fill" height="22px" class="-ml-2"/>Discord</button>
  </CenteredCard>
</div>