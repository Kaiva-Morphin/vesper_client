<script lang="ts">
  import Icon from "@iconify/svelte";
  import CenteredCard from "../../components/containers/centered_card.svelte";
  import BorderInput from "../../components/content/border_input.svelte";
  import BorderCheckbox from "../../components/content/border_checkbox.svelte";

  
</script>

<CenteredCard>
  <strong class="text-center text-2xl ">Welcome to Vesper!</strong>
  <div class="horizontal_separator min-w-[256px] "></div>
  <form class="flex flex-col gap-[10px]">
    <BorderInput icon="mingcute:user-3-line" placeholder="Username"/>
    <BorderInput icon="mingcute:inbox-2-line" placeholder="Email"/>
    <BorderInput icon="mingcute:key-2-line" password placeholder="Password"/>
    <div class="w-full flex flex-row gap-2">
      <button class="btn btn-border btn-primary"><Icon icon="mingcute:mail-send-line" height="22px" class="-ml-2"/> Send</button>
      <BorderInput icon="mingcute:mail-open-line" placeholder="Email code" extraClass="flex-grow"/>
    </div>
    <div class="flex items-center gap-2"><label class="cursor-pointer flex items-center gap-2"><BorderCheckbox extra_class="checkbox-primary"/>I agree with</label> <a href="about/tos" class="link link-primary">terms of service</a></div>
    <button class="btn btn-border btn-primary"><Icon icon="mingcute:user-add-2-line" height="22px" class="-ml-2"/>Register</button>
    <p class="text-center">If you are not new, you can <a href="login" class="link link-primary">Log in</a></p>
  </form>
</CenteredCard>