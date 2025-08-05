<script lang="ts">
  import Icon from "@iconify/svelte";
  import CenteredCard from "../../../components/containers/centered_card.svelte";
  import BorderInput from "../../../components/content/border_input.svelte";
  import BorderCheckbox from "../../../components/content/border_checkbox.svelte";
  import Popup from "../../../components/popup.svelte";
  import Turnstile from "../../../components/content/turnstile.svelte";
  import Separator from "../../../components/content/separator.svelte";

  let temp_token = sessionStorage.getItem("temp_register_token");
  if (temp_token == null) {
    newToast("No token provided!", "btn-error");
    goto('/login');
  }
  sessionStorage.removeItem("temp_register_token");

  let username = $state("");
  let username_ok : null | boolean = $state(null);
  let username_reg : null | boolean = $state(null);
  let username_available : null | boolean = $state(null);
  let password = $state("");
  let password_ok : null | boolean = $state(null);
  let repeat_password = $state("");
  let repeat_password_ok : null | boolean = $state(null);
  let tos_accepted = $state(false);

  let username_timer : null | number = null;
  let check_delay = 200;
  let lazy_check_delay = 5000;

  
  async function checkUsername() {
    username_available = await checkUid(username);
    if (username_timer != null) {clearTimeout(username_timer)};
    username_timer = setTimeout(checkUsername, lazy_check_delay);
  }
  
  onDestroy(() => {if (username_timer != null) {clearTimeout(username_timer)}})
  
  $effect(() => {
    username; // just to watch username
    if (username_timer != null) {clearTimeout(username_timer)};
    username_available = null;
    if (username_reg != true) {
      return;
    }
    username_timer = setTimeout(checkUsername, check_delay);
  });

  $effect(() => {
    if (username.trim() != "") {
      username_reg = USERNAME_RE.test(username);
    } else {
      username_reg = null;
    }
  });

  $effect(() => {
    if (username_reg == false) {
      username_ok = false;
      return;
    }
    if (username_reg != null) {
      if (username_available != true) {
        username_ok = username_available;
        return;
      }
    }
    username_ok = username_reg;
  })

  $effect(() => {
    if (password != "") {
      password_ok = PASSWORD_RE.test(password);
    } else {
      password_ok = null;
    }
  });
  $effect(() => {
    if (repeat_password != "") {
      repeat_password_ok = repeat_password == password; 
    } else {
      repeat_password_ok = null;
    }
  });

  let popup_callback : null | ((token: string) => void) = $state(null);
  let process_popup : boolean = $state(false);

  function registerPressed() {
    const allOk = username_ok &&  password_ok && repeat_password_ok && tos_accepted;
    if (!allOk) {
      if (!username_ok) shakeById('username');
      if (!password_ok) shakeById('password');
      if (!repeat_password_ok) shakeById('repeat_password');
      if (!tos_accepted) shakeById('tos');
      newToast("Please fix the highlighted fields", "btn-error");
      return;
    }
    popup_callback = (token: string) => {
      (async () => {
        popup_callback = null;
        if (temp_token == null) {return;}
        process_popup = true;
        let r = await oauth_register(token, temp_token, username, password);
        if (typeof r === "string") {
          let e = determineRegisterError(r);
          newToast(r, "btn-error");
          switch (e) {
            case 'TOS': shakeById('tos'); break;
            case 'EMAIL_EXISTS':
            case 'INVALID_EMAIL': shakeById('email'); break;
            case 'INVALID_EMAIL_CODE': shakeById('email_code'); break;
            case 'INVALID_PASSWORD': shakeById('password'); shakeById('repeat_password'); break;
            case 'INVALID_USERNAME':
            case 'USERNAME_EXISTS': shakeById('username'); break;
          }
        } else {
          setAccess(r);
          newToast("Welcome to Vesper!", "btn-success");
          goto("/")
        }
        process_popup = false;
      })()
    };
  }

  import { newToast } from "$lib/toast.svelte";
  import { checkUid, determineRegisterError, oauth_register, register, requestRegisterCode } from "$lib/api/auth.svelte";
  import { onDestroy } from "svelte";
  import { setAccess } from "$lib/token.svelte";
  import { PASSWORD_RE, USERNAME_RE } from "$lib/regexps.svelte";
  import { shakeById } from "$lib/util.svelte";
  import { goto } from "$app/navigation";
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
  <CenteredCard class="flex flex-col gap-[10px]">
    <strong class="text-center text-2xl">Finish registration</strong>
    <Separator/>
      <BorderInput id="username" bind:value={username} autocomplete="username" icon="mingcute:user-3-line" placeholder="Username" ok_state={username_ok} err_hint={username_available == false ? "Username taken" : "Username must be 3–24 characters, letters/numbers/underscores only"}/>
      <BorderInput id="password" bind:value={password} autocomplete="new-password" icon="mingcute:key-2-line" password placeholder="Password" ok_state={password_ok} err_hint="Password must be 8–32 and contain only letters/numbers and -+=$#~@*;:.<>\/|!"/>
      <BorderInput id="repeat_password" bind:value={repeat_password} autocomplete="new-password" icon="mingcute:keyhole-line" password placeholder="Repeat password" ok_state={repeat_password_ok} err_hint="Passwords do not match!"/>
      <div id="tos" class="flex items-center gap-2"><label class="cursor-pointer flex items-center gap-2"><BorderCheckbox bind:checked={tos_accepted} class="checkbox-primary"/>I agree with</label> <a href="about/tos" class="link link-primary">terms of service</a></div>
      <button class="btn btn-border btn-primary" onclick={registerPressed}><Icon icon="mingcute:user-add-2-line" height="22px" class="-ml-2"/>Register</button>
  </CenteredCard>
</div>
