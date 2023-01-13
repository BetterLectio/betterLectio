<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { themeChange } from "theme-change";
  import "../app.css";
  import PageTransition from "../components/PageTransition.svelte";
  import { brugeren, instillinger } from "../components/store.js";
  import Avatar from "../components/Avatar.svelte";
  import { reloadData } from "../components/http";
  import { cookieInfo } from "../components/CookieInfo";
  import Notify from "../components/Notify.svelte";
  import SideBar from "../components/SideBar.svelte";
  import NavBar from "../components/NavBar.svelte";
  export let data;

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  onMount(() => {
    themeChange(false);
    if (
      window.location.href.indexOf("betlec.netlify.app") > -1 &&
      window.location.href.indexOf("dev--betlec.netlify.app") == -1
    ) {
      window.location.href = "https://betterlectio.dk";
    }
  });
  import GlobalSearch from "../components/GlobalSearch.svelte";

  let checked = "";
  function handleClick() {
    checked == "checked" ? (checked = "") : (checked = "checked");
  }

  if ($instillinger == null) {
    $instillinger = {
      sidebar: true,
    }
  }
</script>

<!--Log ud pop up-->
<Notify />
<input type="checkbox" id="logud-modal" class="modal-toggle" />
<label for="logud-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">Er du sikker på at du vil logge ud?</h3>
    <p class="py-4">
      Du vil blive logget ud af Better Lectio. Når du logger ind igen, skal du indtaste dit lectio brugernavn
      og kodeord.
    </p>
    <span class="flex">
      <div class="modal-action">
        <label for="logud-modal" class="btn">Forbliv logget ind</label>
      </div>
      <div class="modal-action ml-2">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <btn
          on:click={() => {
            const skoleId = localStorage.getItem("skole_id");
            const theme = localStorage.getItem("theme");

            localStorage.clear();

            localStorage.setItem("skole_id", skoleId);
            localStorage.setItem("theme", theme);

            window.location.href = "/";
          }}
          class="btn-error btn">Log mig ud!</btn
        >
      </div>
    </span>
  </label>
</label>
<GlobalSearch />

{#if $instillinger.sidebar && window.innerWidth > 768}
  <SideBar />
  <div class="md:ml-16">
    <div class="container mx-auto md:pt-10 w-full">
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </div>
  </div>
{:else}
  <NavBar>
    <div class="container mx-auto">
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </div>
  </NavBar>
{/if}
