<script>
  import { fly } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";

  import Konto from "./routes/Konto.svelte";
  import Api from "./routes/Api.svelte";
  import Pro from "./routes/Pro.svelte";
  import Tema from "./routes/Tema.svelte";
  import Tilslut from "./routes/Tilslut.svelte";

  let prevPage = "";
  let page = "konto"

  function changePage(newPage) {
    prevPage = page;
    page = newPage;
    document.getElementById(prevPage).classList.remove("tab-active");
    document.getElementById(page).classList.add("tab-active");
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
    <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut}} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
      <Konto />
    </div>
  {:else if page === "api"}
    <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut}} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
      <Api />
    </div>
  {:else if page === "pro"}
    <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut}} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
      <Pro />
    </div>
  {:else if page === "tema"}
    <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut}} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
      <Tema />
    </div>
  {:else if page === "tilslut"}
    <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut}} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
      <Tilslut />
    </div>
  {/if}
</div>