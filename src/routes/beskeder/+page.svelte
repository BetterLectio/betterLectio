<script>
  import { informationer, beskeder, brugeren } from "../../components/store.js";
  import { get } from "../../components/http.js";
  import Avatar from "../../components/Avatar.svelte";
  import { cookieInfo } from "../../components/CookieInfo";

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
    const _informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries(_informationer.elever)) {
      let navn = key.split("(").at(-1).split(" ");
      navn.pop();
      navn = navn.join(" ");
      navn = `${key.split(navn)[0].slice(0, -1)}(${navn})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ..._informationer.lærere, ..._elever };
  });

  get(`/beskeder2`).then((data) => {
    const _beskeder = data.map((besked) => {
      besked.datoObject = convertDate(besked.dato);
      return besked;
    });
    $beskeder = [..._beskeder];
  });

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

<body>
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
      <input
        type="text"
        placeholder="Søg"
        class="input m-0 mt-4 h-10 w-fit bg-base-200 sm:mt-0 sm:ml-4 sm:w-fit"
        bind:value={searchString}
      />
    </span>
    {#if cookie?.userid}
      <div class="right-1 mb-2 flex items-center rounded-md bg-base-200 p-1">
        <a
          href={`https://www.lectio.dk/lectio/${cookie.school}/beskeder2.aspx?type=nybesked&elevid=${cookie.userid}`}
          target="_blank"
          class="btn-primary btn-sm btn border-base-200 bg-base-200 font-normal normal-case text-gray-500 hover:text-gray-100"
          >Skriv besked</a
        >
      </div>
    {/if}
  </div>

  <!-- main content -->
  {#if $beskeder}
    <ul class="list w-full">
      {#each Array.from($beskeder) as besked}
        {#if selected == "Alle" || (selected == "Sendte" && isAuther(besked.førsteBesked)) || (selected == "Modtaget" && !isAuther(besked.førsteBesked))}
          {#if !searchString || besked.emne.toLowerCase().includes(searchString.toLowerCase())}
            <li class="rounded-md p-2 hover:bg-base-100">
              <a class="block" href="/besked?id={besked.message_id}">
                <div class="flex justify-between">
                  <div class="ml-1 flex items-center">
                    {#if $informationer?.lærereOgElever?.[besked.førsteBesked]}
                      <Avatar id={$informationer.lærereOgElever[besked.førsteBesked]} navn={besked.førsteBesked} />
                    {/if}
                    <div class="ml-5">
                      <p part="emne" class="text-lg font-bold">
                        {besked.emne}
                      </p>
                      <p part="afsender">
                        {besked.førsteBesked} · {besked.ændret}
                      </p>
                    </div>
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
                          <div
                            class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-white"
                          >
                            +{besked.modtagere.length - 3}
                          </div>
                        {/if}
                      {/if}
                    </div>
                  </div>
                </div>
              </a>
            </li>
          {/if}
        {/if}
      {/each}
    </ul>
  {/if}
</body>
