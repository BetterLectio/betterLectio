<script>
  import { get } from "../components/http.js";
  import {
    opgaver,
    nyheder,
    lektier,
    forside,
    skema,
    beskeder,
    fravaer,
    dokumenter,
    informationer,
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

  get("/fravaer").then((data) => {
    $fravaer = data;
    loadingProgress++;
  });

  get("/dokumenter").then((data) => {
    $dokumenter = data;
    loadingProgress++;
  });

  let elevObjArray = [];
  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      elevObjArray.push({ navn: navn, id: value });
    }
    loadingProgress++;
  });

  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };

    get(`/beskeder2`).then((data) => {
      $beskeder = data.map((besked) => {
        besked.datoObject = convertDate(besked.dato);
        return besked;
      });
      $beskeder = [...$beskeder]
      //.sort((a, b) => Date.parse(new Date(a.date)) - Date.parse(new Date(b.date)));

      $beskeder.forEach(besked => {
        allowed[besked.message_id] = true;
        besked.modtagere.forEach(modtager => {
          if ($informationer.lærereOgElever[modtager] == undefined) {
            allowed[besked.message_id] = false;
          }
        })
      });
    });
    loadingProgress++;
  });

  let searchString = "";
  let searchResults = {
    opgaver: [],
    lektier: [],
    forside: [],
    skema: [],
    beskeder: [],
    fravaer: [],
    dokumenter: [],
    elever: [],
  };

  function deleteSearchResults() {
    searchResults = {
      opgaver: [],
      lektier: [], //not working currently
      forside: [],
      skema: [],
      beskeder: [],
      fravaer: [], //not working currently
      dokumenter: [], //not working currently
      elever: [],
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

    
    $forside.aktuelt.forEach((forside) => {
      if (forside.text.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.forside.push(forside);
      }
    });

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

    elevObjArray.forEach((elev) => {
      if (elev.navn.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.elever.push(elev);
      }
    });

    console.log(searchResults);
  }
</script>

<!-- <GlobalSearch /> -->
<div class="flex flex-col bg-base-200 w-full p-2 rounded-lg">
  <div class="flex flex-row w-full">
    {#if loadingProgress != numOfLoads}
    <input
      type="text"
      placeholder="Indlæser... {Math.round(loadingProgress/numOfLoads*100)}%"
      id="input"
      class="input-bordered w-full input bg-base-300"
    />
    {:else}
    <input
      type="text"
      placeholder="Søg"
      id="input"
      class="input-bordered input-primary w-full input bg-base-300"
      bind:value={searchString}
      on:change={search}
    />
    {/if}
  </div>
  <!--results-->
  <ul class="menu rounded-box mt-2 p-1">


    {#if searchResults.opgaver.length > 0}
      <li class="menu-title" transition:fade="{{duration: 200}}">
        <span>Opgaver</span>
      </li>
      {#each searchResults.opgaver as opgave}
        <li class="w-full" transition:fade="{{duration: 200}}">
          <a href="/opgave?exerciseid={opgave.exerciseid}">{opgave.opgavetitel}</a>
        </li>
      {/each}
    {/if}


    {#if searchResults.forside.length > 0}
      <li class="menu-title w-full" transition:fade="{{duration: 200}}">
        <span>Forside</span>
      </li>
      {#each searchResults.forside as forside}
        <li class="w-full" transition:fade="{{duration: 200}}">
          <a href="/forside" class="w-full overflow-x-scroll">{forside.text}</a>
        </li>
      {/each}
    {/if}


    {#if searchResults.skema.length > 0}
      <li class="menu-title w-full" transition:fade="{{duration: 200}}">
        <span>Skema</span>
      </li>
      {#each searchResults.skema as modul}
        <li class="w-full" transition:fade="{{duration: 200}}">
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
      <li class="menu-title w-full" transition:fade="{{duration: 200}}">
        <span>Beskeder</span>
      </li>
      {#each searchResults.beskeder as besked}
        <li class="w-full" transition:fade="{{duration: 200}}">
          <a href="/besked?id={besked.message_id}">{besked.emne}</a>
        </li>
      {/each}
    {/if}

    {#if searchResults.elever.length > 0}
      <li class="menu-title w-full" transition:fade="{{duration: 200}}">
        <span>Elever</span>
      </li>
      {#each searchResults.elever as elev}
        <li class="w-full" transition:fade="{{duration: 200}}">
          <p>{elev.navn}</p>
        </li>
      {/each}
    {/if}
    


    <!-- add missing things here-->
  </ul>
</div>
