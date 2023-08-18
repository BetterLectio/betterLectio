<script>
  import ErrorMsg from "$lib/components/ErrorMsg.svelte";
  import GlobalSearch from "$lib/components/GlobalSearch.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Notify from "$lib/components/Notify.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import SideBar from "$lib/components/SideBar.svelte";
  import { cookieInfo } from "$lib/js/CookieInfo";
  import { get } from "$lib/js/http.js";
  import { addNotification } from "$lib/js/notifyStore.js";
  import { brugeren, hold, indstillinger } from "$lib/js/store.js";
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";
  import PageLoadTopBar from "$lib/components/PageLoadTopBar.svelte";
  import "../app.css";

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

  let windowWidth = window.innerWidth;
  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);

  function electronAlert(event, message) {
    addNotification(message, "alert-warning");
  }

  $indstillinger ??= {};
  $indstillinger.sidebar ??= false;
  $indstillinger.brugHoldOversætter ??= true;
  $indstillinger.opgaver ??= {};
  $indstillinger.opgaver.visFristAbsolut ??= false;
  $indstillinger.opgaver.visHeleBeskrivelsen ??= false;

  $indstillinger.skema ??= {};
  $indstillinger.skema.classesWithDifferentColors ??= true;
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
    <p class="py-4">Du vil blive logget ud af BetterLectio. Når du logger ind igen, skal du indtaste dit lectio brugernavn og kodeord.</p>
    <span class="flex">
      <div class="modal-action">
        <label for="logud-modal" class="btn">Forbliv logget ind</label>
      </div>
      <div class="modal-action ml-2">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          on:click={() => {
            const skoleId = localStorage.getItem("skole_id");
            const theme = localStorage.getItem("theme");

            localStorage.clear();

            localStorage.setItem("skole_id", skoleId);
            localStorage.setItem("theme", theme);

            window.location.href = "/auth";
          }}
          class="btn-error btn">Log mig ud!</button
        >
      </div>
    </span>
  </label>
</label>
<GlobalSearch />

<PageLoadTopBar />
{#if $indstillinger?.sidebar && windowWidth > 768}
  <SideBar />
  <div class="md:ml-16">
    <main class="md:w-[calc(100%-32px)] w-[calc(100%-16px)] md:pt-10 mx-2 md:mx-4 2xl:container 2xl:mx-auto 2xl:w-full">
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </main>
  </div>
{:else}
  <NavBar>
    <main class="md:w-[calc(100%-32px)] w-[calc(100%-16px)] mx-2 md:mx-4 2xl:container 2xl:mx-auto 2xl:w-full">
      <PageTransition pathname={data.pathname}>
        <slot />
      </PageTransition>
    </main>
  </NavBar>
{/if}
