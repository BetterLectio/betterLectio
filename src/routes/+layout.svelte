<script>
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";
  import "../app.css";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import { brugeren, indstillinger, hold } from "$lib/js/store.js";
  import { cookieInfo } from "$lib/js/CookieInfo";
  import Notify from "$lib/components/Notify.svelte";
  import SideBar from "$lib/components/SideBar.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import { addNotification } from "$lib/js/notifyStore.js";
  import { get } from "$lib/js/http.js";
  import ErrorMsg from "$lib/components/ErrorMsg.svelte";

  export let data;

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  if (!window.location.href.includes("auth")) {
    get("/mig").then((data) => {
      $brugeren = data;
    });
  }

  onMount(() => {
    themeChange(false);
  });
  import GlobalSearch from "$lib/components/GlobalSearch.svelte";

  let windowWidth = window.innerWidth;
  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);

  function electronAlert(event, message) {
    addNotification(message, "alert-warning");
  }

  $indstillinger ||= {};
  $indstillinger.sidebar ||= false;
  $indstillinger.brugHoldOversætter ||= true;
  $indstillinger.opgaver ||= {};
  $indstillinger.opgaver.visFristAbsolut ||= false;
  $indstillinger.opgaver.visHeleBeskrivelsen ||= false;

  $indstillinger.skema ||= {};
  $indstillinger.skema.classesWithDiffrentColors ||= true;
  if ($hold === [] || !$hold) {
    $hold = [
      { fag: "Dansk", forkortelse: "da" },
      { fag: "Matematik", forkortelse: "ma" },
      { fag: "Teknologi", forkortelse: "ti" },
      { fag: "Engelsk", forkortelse: "en" },
      { fag: "Historie", forkortelse: "hi" },
      { fag: "Biologi", forkortelse: "bi" },
      { fag: "Kemi", forkortelse: "ke" },
      { fag: "Fysik", forkortelse: "fy" },
      { fag: "Samfundsfag", forkortelse: "sa" },
      { fag: "komm/it", forkortelse: "kit" },
    ];
  }
</script>

<!-- error modal -->
<ErrorMsg />
<!--Log ud pop up-->
<Notify />
<input type="checkbox" id="logud-modal" class="modal-toggle" />
<label for="logud-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">Er du sikker på at du vil logge ud?</h3>
    <p class="py-4">Du vil blive logget ud af Better Lectio. Når du logger ind igen, skal du indtaste dit lectio brugernavn og kodeord.</p>
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

            window.location.href = "/auth";
          }}
          class="btn-error btn">Log mig ud!</btn
        >
      </div>
    </span>
  </label>
</label>
<GlobalSearch />

{#if $indstillinger?.sidebar && windowWidth > 768}
  <SideBar />
  <div class="md:ml-16">
    <div class="container mx-auto w-full md:pt-10">
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
