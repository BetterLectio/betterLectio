<script>
  import { get } from "../components/http.js";
  import {
    opgaver, //✅
    nyheder, //✅
    lektier, //✅
    forside, //✅
    skema, //✅
    beskeder, //✅
    fravaer, //✅
    dokumenter, //✅
    informationer, //✅
  } from "../components/store.js";

  import { fade } from "svelte/transition";

  const numOfLoads = 9;
  let loadingProgress = 0;

  get("/opgaver").then((data) => {
    $opgaver = data;
    loadingProgress++;
  });

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

  $: if (loadingProgress == numOfLoads) {
    // not working ?????? why!!!!!
    document.querySelector(".input").placeholder = "Søg";
  }

  let searchString = "";
  let searchResults = {
    opgaver: [],
    lektier: [], //not working currently
    forside: [], //not working currently
    skema: [], //not working currently
    beskeder: [], //not working currently
    fravaer: [], //not working currently
    dokumenter: [], //not working currently
    informationer: [], //not working currently
  };

  function deleteSearchResults() {
    searchResults = {
      opgaver: [],
      lektier: [], //not working currently
      forside: [], //not working currently
      skema: [],
      beskeder: [],
      fravaer: [], //not working currently
      dokumenter: [], //not working currently
      informationer: [], //not working currently
    };
  }

  function search() {
    if (searchString == "") return;

    deleteSearchResults();
    console.log(searchString);

    $opgaver.forEach((opgave) => {
      if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.opgaver.push(opgave);
      }
    });

    // Cant test this because of i dont have any lektier :)
    //$lektier.forEach((lektie) => {
    //  if (lektie.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
    //    searchResults.lektier.push(lektie);
    //  }
    //});

    // forside not important for now
    //$forside.forEach((forside) => {
    //  if (forside.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
    //    searchResults.forside.push(forside);
    //  }
    //});

    $skema.moduler.forEach((modul) => {
      if (modul.navn) {
        if (modul.navn.toLowerCase().includes(searchString.toLowerCase())) {
          searchResults.skema.push(modul);
        }
      }
      if (modul.hold) {
        if (modul.hold.toLowerCase().includes(searchString.toLowerCase())) {
          searchResults.skema.push(modul);
        }
      }
      if (modul.andet) {
        if (modul.andet.toLowerCase().includes(searchString.toLowerCase())) {
          searchResults.skema.push(modul);
        }
      }
      if (modul.tidspunkt.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.skema.push(modul);
      }
    });

    $beskeder.beskeder.forEach((besked) => {
      if (besked.emne.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.beskeder.push(besked);
      } 
      if (besked.førsteBesked.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.beskeder.push(besked);
      }
    });

    // rest goes here :)
    console.log(searchResults);
  }
</script>

<!-- <GlobalSearch /> -->
<div class="flex flex-col bg-base-200 w-fit p-2 rounded-lg">
  <div class="flex flex-row">
    <input
      type="text"
      placeholder="Indlæser... ({loadingProgress}/{numOfLoads})"
      id="input"
      class="input-bordered input-primary input bg-base-300"
      bind:value={searchString}
      on:change={search}
    />
  </div>
  <!--results-->
  <ul class="menu rounded-box mt-2 w-52 p-1">
    {#if searchResults.opgaver.length > 0}
      <li class="menu-title w-52" transition:fade="{{duration: 200}}">
        <span>Opgaver</span>
      </li>
      {#each searchResults.opgaver as opgave}
        <li class="w-52" transition:fade="{{duration: 200}}">
          <a href="/opgave?exerciseid={opgave.exerciseid}">{opgave.opgavetitel}</a>
        </li>
      {/each}
    {/if}
    <!-- add missing things here-->
    {#if searchResults.skema.length > 0}
      <li class="menu-title w-52" transition:fade="{{duration: 200}}">
        <span>Skema</span>
      </li>
      {#each searchResults.skema as modul}
        <li class="w-52" transition:fade="{{duration: 200}}">
          <a href="/modul?absid={modul.absid}">
          {#if modul.navn}
            {modul.navn}
          {:else if modul.hold}
            {modul.hold}
          {:else if modul.andet}
            {modul.andet}
          {/if}
          </a>
        </li>
      {/each}
    {/if}
    {#if searchResults.beskeder.length > 0}
      <li class="menu-title w-52" transition:fade="{{duration: 200}}">
        <span>Beskeder</span>
      </li>
      {#each searchResults.beskeder as besked}
        <li class="w-52" transition:fade="{{duration: 200}}">
          <a href="/besked?id={besked.message_id}">{besked.emne}</a>
        </li>
      {/each}
    {/if}
    
    <!-- add missing things here-->
  </ul>
</div>
