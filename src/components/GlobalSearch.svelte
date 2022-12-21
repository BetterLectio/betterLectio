<script>
  import { get } from "../components/http.js";
  import {
    nyheder,
    lektier, //✅
    forside, //✅
    skema, //✅
    beskeder, //✅
    fravaer, //✅
    dokumenter, //✅
    informationer, //✅
  } from "../components/store.js";

  import { fade } from "svelte/transition";

  const numOfLoads = 8;
  let loadingProgress = 0;

  fetch("https://raw.githubusercontent.com/BetterLectio/news/main/news.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $nyheder = data["news"];
      loadingProgress++;
    });

  get("/lektier").then((data) => {
    $lektier = data;
    loadingProgress++;
  });

  get("/forside").then((data) => {
    $forside = data;
    loadingProgress++;
  });

  get("/skema").then((data) => {
    $skema = data;
    loadingProgress++;
  });

  get("/beskeder").then((data) => {
    $beskeder = data;
    loadingProgress++;
  });

  get("/fravaer").then((data) => {
    $fravaer = data;
    loadingProgress++;
  });

  get("/dokumenter").then((data) => {
    $dokumenter = data;
    loadingProgress++;
  });

  get("/informationer").then((data) => {
    $informationer = data;
    loadingProgress++;
  });
</script>

<!-- <GlobalSearch /> -->
<div class="flex w-52 flex-col">
  {#if loadingProgress < numOfLoads}
  <progress class="progress" value={loadingProgress} max={numOfLoads} transition:fade={{duration:100, delay:0}} />
  {:else}
  <input type="text" placeholder="Søg" class="input-bordered input-primary input bg-base-300" transition:fade={{duration:100, delay:100}} />
  {/if}
  <!--results-->
</div>
