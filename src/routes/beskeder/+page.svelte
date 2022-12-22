<script>
  import { informationer, beskeder, brugeren } from "../../components/store.js";
  import { get } from "../../components/http.js";
  import Avatar from "../../components/Avatar.svelte";

  get("/mig").then((data) => {
    $brugeren = data;
  });

  /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */

  let allowed = {};
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

  const CokieInfo = async () => {
    if (!localStorage.getItem("authentication")) {
      console.log("Redirect");
      window.location.href = "/auth";
    } else {
      let decodedCookie = atob(localStorage.getItem("authentication"));
      cookie = JSON.parse(decodedCookie);
      return {
        user: cookie["LastLoginUserName"],
        school: cookie["LastLoginExamno"],
        userid: cookie["LastLoginElevId"],
      };
    }
  };
  let cookie;
  CokieInfo().then((data) => {
    cookie = data;
  });

  let selected = "Alle";
  let searchString = "";

  function isAuther(messageAuther) {
    return messageAuther.replace("(", "").replace(")", "") == $brugeren.navn.replace(",", "");
  }
</script>

<body>
  <span class="my-2 flex justify-between">
    <h1 class="text-3xl font-bold">Beskeder</h1>
  </span>
  <div class="flex justify-between">
    <span class="mb-2 flex flex-col sm:flex-row">
      <div class="tabs tabs-boxed w-fit">
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
      <div class="mb-2 flex right-1 items-center bg-base-200 p-1 rounded-md">
        <a href={`https://www.lectio.dk/lectio/${cookie.school}/beskeder2.aspx?type=nybesked&elevid=${cookie.userid}`} target="_blank" class="btn btn-sm bg-base-200 border-base-200 text-gray-500 hover:text-gray-100 btn-primary normal-case font-normal">Skriv besked</a>
      </div>
    {/if}
  </div>

  <!-- main content -->
  <ul class="list w-full">
    {#each Array.from($beskeder) as besked}
      {#if selected == "Alle" || (selected == "Sendte" && isAuther(besked.førsteBesked)) || (selected == "Modtaget" && !isAuther(besked.førsteBesked))}
        {#if !searchString || besked.emne.toLowerCase().includes(searchString.toLowerCase())}
          <li class="hover:bg-base-100 p-2 rounded-md">
            <a class="block" href="/besked?id={besked.message_id}">
              <div class="flex justify-between">
                <div class="flex items-center ml-1">
                  {#if $informationer?.lærereOgElever?.[besked.førsteBesked]}
                    <Avatar
                      id={$informationer.lærereOgElever[besked.førsteBesked]}
                      navn={besked.førsteBesked}
                    />
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
                  <div class="flex -space-x-4 mr-1">
                    {#if window.innerWidth > 640}
                      {#if allowed[besked.message_id]}
                        {#each besked.modtagere.slice(0, 3) as modtager}
                          {#if $informationer.lærereOgElever[modtager] != null}
                            <div class="z-0">
                              <Avatar
                                id={$informationer.lærereOgElever[modtager]}
                                navn={modtager}
                                size="h-10 w-10"
                              />
                            </div>
                          {/if}
                        {/each}
                        {#if besked.modtagere.length > 3}
                          <div
                            class="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white"
                          >
                            +{besked.modtagere.length - 3}
                          </div>
                        {/if}
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
</body>