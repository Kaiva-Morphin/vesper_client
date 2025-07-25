<script lang="ts">
  import Icon from "@iconify/svelte";
  import CenteredCard from "../../components/containers/centered_card.svelte";
  import BorderInput from "../../components/content/border_input.svelte";
  import LabelSeparator from "../../components/content/label_separator.svelte";
</script>

<CenteredCard>
  <strong class="text-center text-2xl">Welcome back!</strong>
  <div class="horizontal_separator min-w-[256px] "></div>
  <BorderInput icon="mingcute:user-4-line" placeholder="Username/Email"/>
  <BorderInput icon="mingcute:key-2-line" password placeholder="Password"/>
  <button class="btn btn-border btn-primary"><Icon icon="mingcute:enter-door-line" height="22px" class="-ml-2"/>Log in</button>
  <div class="w-full flex flex-row justify-between">
    <a href="password_recovery" class="link link-primary">Forgot password?</a>
    <a href="register" class="link link-primary">Sign up</a>
  </div>
  <LabelSeparator><strong>OR</strong></LabelSeparator>
  <a href="about" class="btn btn-border btn-primary"><Icon icon="ri:google-fill" height="22px" class="-ml-2"/>Google</a>
  <a href="about" class="btn btn-border btn-primary"><Icon icon="ri:discord-fill" height="22px" class="-ml-2"/>Discord</a>
</CenteredCard>