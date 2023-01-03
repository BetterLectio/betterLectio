<script>
  import { fly } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";

  import Konto from "./routes/Konto.svelte";
  import Api from "./routes/Api.svelte";
  import Pro from "./routes/Pro.svelte";
  import Tema from "./routes/Tema.svelte";
  import Tilslut from "./routes/Tilslut.svelte";

  let pageTransitionDirection;

  let prevPage = "";
  let page = "konto"

  function changePage(newPage) {
    prevPage = page;
    page = newPage;
    determineDirection();
    document.getElementById(prevPage).classList.remove("tab-active");
    document.getElementById(page).classList.add("tab-active");
  }

  function getPagePosition(p) { // more like getPageIndex idk
    switch (p) {
      case "konto":
        return 0;
      case "api":
        return 1;
      case "pro":
        return 2;
      case "tema":
        return 3;
      case "tilslut":
        return 4;
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
  <a id="konto" class="tab tab-active" on:click={() => changePage("konto")}>Konto</a>
  <a id="api" class="tab" on:click={() => changePage("api")}>API</a>
  <a id="pro" class="tab" on:click={() => changePage("pro")}>Pro</a>
  <a id="tema" class="tab" on:click={() => changePage("tema")}>Tema</a>
  <a id="tilslut" class="tab" on:click={() => changePage("tilslut")}>Tilslut</a>
</div>

<div>
  {#if page === "konto"}
    <div in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut}} out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}>
      <Konto />
    </div>
  {:else if page === "api"}
    <div in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut}} out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}>
      <Api />
    </div>
  {:else if page === "pro"}
    <div in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut}} out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}>
      <Pro />
    </div>
  {:else if page === "tema"}
    <div in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut}} out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}>
      <Tema />
    </div>
  {:else if page === "tilslut"}
    <div in:fly={{ x: -pageTransitionDirection, duration: 300, delay: 300, easing: quintOut}} out:fly={{ x: pageTransitionDirection, duration: 300, easing: quintIn }}>
      <Tilslut />
    </div>
  {/if}
</div>