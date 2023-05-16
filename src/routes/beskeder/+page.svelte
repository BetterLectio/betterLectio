<script>
  import { informationer, beskeder, brugeren } from "$lib/js/store.js";
  import { get } from "$lib/js/http.js";
  import Avatar from "$lib/components/Avatar.svelte";
  import { cookieInfo } from "$lib/js/CookieInfo";
  import { fade, fly } from "svelte/transition";
  import BrugerPopup from "$lib/components/BrugerPopup.svelte";

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });
  get("/mig").then((data) => {
    $brugeren = data;
  });

  /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */

  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(").at(-1).split(" ");
      navn.pop();
      navn = navn.join(" ");
      navn = `${key.split(navn)[0].slice(0, -1)}(${navn})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
  });

  let ready = false;
  let _beskeder = [];
  let nrOfShownMessages = 50;

  get(`/beskeder2`).then((data) => {
    _beskeder = data.map((besked) => {
      besked.datoObject = convertDate(besked.dato);
      return besked;
    });
    $beskeder = [..._beskeder];
    // only include the first 10 messages
    $beskeder = $beskeder.slice(0, 50);
    ready = true;
  });

  function showMore() {
    nrOfShownMessages += 50;
    $beskeder = [..._beskeder.slice(0, nrOfShownMessages)];
  }

  function convertDate(dateString) {
    // Split the date string into parts
    const allparts = dateString.split(" ");
    const parts = allparts[0].split("-");
    const year = parseInt(parts[1], 10);
    const dateparts = parts[0].split("/");
    const timepart = allparts[1].split(":");
    const hour = parseInt(timepart[0], 10);
    const minute = parseInt(timepart[1], 10);
    // Extract the day, month, and year from the parts array
    const day = parseInt(dateparts[0], 10);
    const month = parseInt(dateparts[1], 10);
    // Create a new Date object
    const date = new Date();
    // Set the day, month, and year of the Date object
    date.setFullYear(year, month - 1, day);
    date.setHours(hour, minute, 0, 0);
    // Return the Date object
    return date;
  }

  let selected = "Alle";
  let searchString = "";

  function isAuther(messageAuther) {
    return messageAuther.replace("(", "").replace(")", "") == $brugeren.navn.replace(",", "");
  }

  function getValidModtagere(modtagere) {
    let validModtagere = [];
    for (const modtager of modtagere) {
      if ($informationer?.lærereOgElever[modtager]) {
        validModtagere.push(modtager);
      }
    }
    return validModtagere;
  }
</script>

<span class="my-2 flex justify-between">
  <h1 class="text-3xl font-bold">Beskeder</h1>
</span>
<div class="flex flex-wrap justify-between">
  <span class="mb-2 flex flex-col sm:flex-row">
    <div class="tabs tabs-boxed flex w-full justify-between">
      <button
        class={selected == "Alle" ? "tab tab-active tab-sm sm:tab-md" : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "Alle";
        }}>Alle</button
      >
      <button
        class={selected == "Modtaget" ? "tab tab-active tab-sm sm:tab-md" : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "Modtaget";
        }}>Modtaget</button
      >
      <button
        class={selected == "Sendte" ? "tab tab-active tab-sm sm:tab-md" : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "Sendte";
        }}>Sendte</button
      >
    </div>
    <input type="text" placeholder="Søg" class="input m-0 mt-4 h-10 w-fit bg-base-200 sm:mt-0 sm:ml-4 sm:w-fit" bind:value={searchString} />
  </span>
  {#if cookie?.userid}
    <div class="right-1 mb-2 flex items-center rounded-md bg-base-200 p-1">
      <a
        data-sveltekit-preload-data
        href={`https://www.lectio.dk/lectio/${cookie.school}/beskeder2.aspx?type=nybesked&elevid=${cookie.userid}`}
        target="_blank"
        class="btn-primary btn-sm btn border-base-200 bg-base-200 font-normal normal-case text-gray-500 hover:text-gray-100">Skriv besked</a
      >
    </div>
  {/if}
</div>

<!-- main content -->
{#if ready}
  {#if $beskeder}
    <ul class="list h-[calc(100vh_-_16.5rem)] w-full overflow-clip">
      {#each Array.from($beskeder) as besked}
        {#if selected == "Alle" || (selected == "Sendte" && isAuther(besked.førsteBesked)) || (selected == "Modtaget" && !isAuther(besked.førsteBesked))}
          {#if !searchString || besked.emne.toLowerCase().includes(searchString.toLowerCase())}
            <li in:fade class="rounded-md p-2 hover:bg-base-100">
              <div class="flex justify-between">
                <div class="ml-1 flex items-center">
                  <BrugerPopup navn={besked.førsteBesked} id={$informationer.lærereOgElever[besked.førsteBesked]}>
                    <Avatar id={$informationer.lærereOgElever[besked.førsteBesked]} navn={besked.førsteBesked} />
                  </BrugerPopup>
                  <a data-sveltekit-preload-data class="block" href="/besked?id={besked.message_id}">
                    <div class="ml-5">
                      <p part="emne" class="text-lg font-bold">
                        {besked.emne}
                      </p>
                      <p part="afsender">
                        {besked.førsteBesked} · {besked.ændret}
                      </p>
                    </div>
                  </a>
                </div>
                <div class="right-1 flex items-center">
                  <div class="mr-1 flex -space-x-4">
                    {#if window.innerWidth > 640}
                      {#each getValidModtagere(besked.modtagere).slice(0, 3) as modtager}
                        {#if $informationer?.lærereOgElever[modtager]}
                          <div class="z-0">
                            <Avatar id={$informationer.lærereOgElever[modtager]} navn={modtager} size="h-10 w-10" />
                          </div>
                        {/if}
                      {/each}
                      {#if getValidModtagere(besked.modtagere).length > 3}
                        <div class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                          +{besked.modtagere.length - 3}
                        </div>
                      {/if}
                    {/if}
                  </div>
                </div>
              </div>
            </li>
          {/if}
        {/if}
      {/each}
      <div class="flex justify-center">
        {#if $beskeder.length != _beskeder.length}
          <button class="btn-info btn-sm btn my-4" on:click={showMore}>Indlæs flere beskeder</button>
        {:else}
          <button class="btn-warning btn-sm btn my-4" on:click={showMore}>Ikke flere beskeder</button>
        {/if}
      </div>
    </ul>
  {:else}
    <div class="m-16 flex h-full items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-base-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <span class="text-gray-500">Indlæser beskeder...</span>
      </div>
    </div>
  {/if}
{/if}
