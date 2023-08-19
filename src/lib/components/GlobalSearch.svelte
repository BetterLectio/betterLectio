<script>
  import { cookieInfo } from "$lib/js/CookieInfo.js";
  import BrugerPopup from "$lib/components/BrugerPopup.svelte";
  import { get } from "$lib/js/http.js";
  let opgaver, nyheder, lektier, forside, skema, beskeder, fravaer, dokumenter;
  const alleElever = [];

  import { blur } from "svelte/transition";

  const numOfLoads = 9;
  let loadingProgress = 0;

  let animationDelay = 0;
  function loadData() {
    get("/opgaver").then((data) => {
      opgaver = data;
      loadingProgress++;
    });

    fetch("https://raw.githubusercontent.com/BetterLectio/news/main/news.json")
      .then((response) => response.json())
      .then((data) => {
        nyheder = data["news"];
        loadingProgress++;
      });

    get("/lektier").then((data) => {
      lektier = data;
      loadingProgress++;
    });

    get("/forside").then((data) => {
      forside = data;
      loadingProgress++;
    });

    let cookie;
    cookieInfo().then((data) => {
      cookie = data;
      get(`/skema?id=${"S" + cookie.userid}`).then((data) => {
        skema = data;
        loadingProgress++;
      });
    });

    get("/fravaer").then((data) => {
      fravaer = { sort: { col: "procent", ascending: true }, data };
      loadingProgress++;
    });

    get("/dokumenter").then((data) => {
      dokumenter = data;
      loadingProgress++;
    });

    get("/informationer").then(($informationer) => {
      for (const [navn, userId] of Object.entries($informationer.elever)) {
        alleElever.push({
          navn,
          id: userId,
        });
      }
      loadingProgress++;
    });

    get(`/beskeder2`).then((data) => {
      beskeder = data.map((besked) => {
        besked.datoObject = convertDate(besked.dato);
        return besked;
      });
      loadingProgress++;
    });
  }

  function convertDate(dateString) {
    // Split the date string into parts
    const allParts = dateString.split(" ");
    const parts = allParts[0].split("-");
    const year = parseInt(parts[1], 10);
    const dateParts = parts[0].split("/");

    const timePart = allParts[1].split(":");
    const hour = parseInt(timePart[0], 10);
    const minute = parseInt(timePart[1], 10);

    // Extract the day, month, and year from the parts array
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);

    // Create a new Date object
    const date = new Date();

    // Set the day, month, and year of the Date object
    date.setFullYear(year, month - 1, day);
    date.setHours(hour, minute, 0, 0);

    // Return the Date object
    return date;
  }

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
    animationDelay = 0;
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
    if (searchString === "") return;

    deleteSearchResults();

    opgaver.forEach((opgave) => {
      if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.opgaver.push(opgave);
      }
    });

    lektier.forEach((lektie) => {
      if (lektie.aktivitet.navn && lektie.aktivitet.navn.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.lektier.push(lektie);
      } else if (lektie.aktivitet.andet.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.lektier.push(lektie);
      }
    });

    forside.aktuelt.forEach((forside) => {
      if (forside.text.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.forside.push(forside);
      }
    });

    skema.moduler.forEach((modul) => {
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

    beskeder.forEach((besked) => {
      if (besked.emne.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.beskeder.push(besked);
      }
      if (besked.førsteBesked.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.beskeder.push(besked);
      }
    });

    alleElever.forEach((elev) => {
      if (elev.navn.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.elever.push(elev);
      }
    });
  }
</script>

<input type="checkbox" id="søg-popup" class="modal-toggle" on:click={() => loadData()} />
{#if localStorage.getItem("lectio-cookie")}
  <label for="søg-popup" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="mb-1 text-xl font-bold">Søg Lectio</h3>
      <p class="mb-4">Søg efter opgaver, elever og meget mere i Lectio.</p>

      <!-- <GlobalSearch /> -->
      <div class="flex w-full flex-col rounded-lg bg-base-200 p-2">
        <div class="flex w-full flex-row">
          <input
            type="text"
            placeholder={loadingProgress >= numOfLoads ? "Søg" : `Indlæser... ${Math.round((loadingProgress / numOfLoads) * 100)}%`}
            id="input"
            class="input-bordered input-primary input w-full bg-base-300"
            bind:value={searchString}
            on:change={search}
          />
        </div>
        <!--results-->
        <ul class="menu rounded-box mt-2 p-1">
          {#if searchResults.opgaver.length > 0}
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Opgaver</span>
            </li>
            {#each searchResults.opgaver as opgave, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <a href="/opgave?exerciseid={opgave.exerciseid}" rel="external">{opgave.opgavetitel}</a>
              </li>
            {/each}
          {/if}

          {#if searchResults.lektier.length > 0}
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Lektier</span>
            </li>
            {#each searchResults.lektier as lektie, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <a href="/modul?absid={lektie.aktivitet.absid}" rel="external">{lektie.aktivitet.navn || lektie.aktivitet.hold}</a>
              </li>
            {/each}
          {/if}

          {#if searchResults.forside.length > 0}
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Forside</span>
            </li>
            {#each searchResults.forside as forside, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <a href="/forside" class="w-full overflow-x-scroll" rel="external">{forside.text}</a>
              </li>
            {/each}
          {/if}

          {#if searchResults.skema.length > 0}
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Skema</span>
            </li>
            {#each searchResults.skema as modul, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <a href="/modul?absid={modul.absid}" rel="external">
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
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Beskeder</span>
            </li>
            {#each searchResults.beskeder as besked, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <a href="/besked?id={besked.message_id}" rel="external">{besked.emne}</a>
              </li>
            {/each}
          {/if}
          {#if searchResults.elever.length > 0}
            <p class="hidden">{animationDelay++}</p>
            <li class="menu-title w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
              <span>Elever</span>
            </li>
            {#each searchResults.elever as elev, i}
              <p class="hidden">{(animationDelay += i)}</p>
              <li class="w-full" in:blur={{ duration: 300, delay: animationDelay * 100 }} out:blur>
                <p><BrugerPopup navn={elev.navn} id={elev.id}>{elev.navn}</BrugerPopup></p>
              </li>
            {/each}
          {/if}

          <!-- add missing things here-->
        </ul>
      </div>
    </label>
  </label>
{/if}
