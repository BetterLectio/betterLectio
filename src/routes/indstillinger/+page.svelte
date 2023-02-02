<script>
  import { fly } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";

  import Konto from "./routes/Konto.svelte";
  import Api from "./routes/Api.svelte";
  import Pro from "./routes/Pro.svelte";
  import Tilslut from "./routes/Tilslut.svelte";
  import Generelt from "./routes/Generelt.svelte";
  import Opdateringer from "./routes/Opdateringer.svelte";

  let pageTransitionDirection;

  let prevPage = "";
  let page = "generelt";

  function changePage(newPage) {
    prevPage = page;
    page = newPage;
    determineDirection();
  }

  function getPagePosition(p) {
    // more like getPageIndex idk
    switch (p) {
      case "generelt":
        return 0;
      case "konto":
        return 1;
      case "api":
        return 2;
      case "pro":
        return 3;
      case "tilslut":
        return 4;
      case "opdateringer":
        return 5;
    }
  }

  function determineDirection() {
    if (getPagePosition(prevPage) < getPagePosition(page)) {
      pageTransitionDirection = 40;
    } else {
      pageTransitionDirection = -40;
    }
  }
</script>

<div class="tabs tabs-boxed mb-4 w-fit">
  <a id="generelt" class="tab {page == 'generelt' ? 'tab-active' : ''}" on:click={() => changePage("generelt")}>Generelt</a>
  <a id="konto" class="tab {page == 'konto' ? 'tab-active' : ''}" on:click={() => changePage("konto")}>Din konto</a>
  <a id="api" class="tab {page == 'api' ? 'tab-active' : ''}" on:click={() => changePage("api")}>API</a>
  <a id="pro" class="tab {page == 'pro' ? 'tab-active' : ''}" on:click={() => changePage("pro")}>Pro</a>
  <a id="tilslut" class="tab {page == 'tilslut' ? 'tab-active' : ''}" on:click={() => changePage("tilslut")}>Tilslut</a>
  <a id="opdateringer" class="tab {page == 'opdateringer' ? 'tab-active' : ''}" on:click={() => changePage("opdateringer")}
    >Opdateringer</a
  >
</div>

<div class="flex min-h-screen">
  <div>
    {#if page === "generelt"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Generelt />
      </div>
    {:else if page === "konto"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Konto />
      </div>
    {:else if page === "api"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Api />
      </div>
    {:else if page === "pro"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Pro />
      </div>
    {:else if page === "tilslut"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Tilslut />
      </div>
    {:else if page === "opdateringer"}
      <div
        in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut }}
        out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}
      >
        <Opdateringer />
      </div>
    {/if}
  </div>
</div>
