<script>
  import { brugeren, nyheder, lektier, beskeder, forside } from "../../components/store.js";
  import { get } from "../../components/http.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";
  import { stringify } from "postcss";

  const md = new MarkdownIt();

  get("/mig").then((data) => {
    $brugeren = data;
  });

  get("/beskeder").then((data) => {
    $beskeder = data;
  });

  get("/lektier").then((data) => {
    $lektier = data;
  });

  get("/forside").then((data) => {
    $forside = data;
  });

  const colorDict = {
    rød: "red-400",
    gul: "yellow-300",
    grå: "grey-300",
    grøn: "green-400"
  }

  function colorModul(modul) {
    let modulType = modul["status"];
    switch (modulType) {
      case "aflyst":
        return "btn btn-error mb-4 block h-fit p-2 normal-case";
      case "ændret":
        return "btn btn-success mb-4 block h-fit p-2 normal-case";
      case "normal":
        return "btn btn-info mb-4 block h-fit p-2 normal-case";
    }
  }

  fetch("https://raw.githubusercontent.com/BetterLectio/news/main/news.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $nyheder = data["news"];
    });

  function getGreeting() {
    let alldayGreetings = ["Velkommen tilbage", "Hejsa", "Velkommen", "Hej"];
    let morningGreetings = ["God morgen", "Go' morgen", "Godmorgen"];
    let afternoonGreetings = ["God eftermiddag"];
    let eveningGreetings = ["God aften", "Tak for i dag", "Godnat"];
    let chosenGreeting = "";
    // Get the current time
    let currentTime = new Date().getHours();
    if (Math.random() > 0.5) {
      if (currentTime >= 5 && currentTime < 12) {
        chosenGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
      } else if (currentTime >= 12 && currentTime < 17) {
        chosenGreeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
      } else {
        chosenGreeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
      }
    } else {
      chosenGreeting = alldayGreetings[Math.floor(Math.random() * alldayGreetings.length)];
    }
    return chosenGreeting;
  }
</script>

<body>
  <!-- greeting -->
  {#if $brugeren}
    <h1 class="mb-4 text-3xl font-bold">{getGreeting()}, {$brugeren.navn}</h1>
  {/if}

  <!-- main content -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <div class="rounded-lg bg-base-300 xl:row-span-4 p-4 shadow-lg md:col-span-2">
      <h2 class="text-2xl font-bold mb-4">Aktuelt</h2>
      <ul class="list-disc ml-4">
        {#each $forside["aktuelt"] as aktuelt}
          {#if aktuelt.punkt_farve == "rød"} <!-- Koden ser sådan ud da colorDict[aktuelt.punkt_farve] ikke render -->
              <li class="mb-4 marker:text-red-400">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a class="btn btn-xs btn-primary" target="_blank"'
                )}
              </li>
          {:else if aktuelt.punkt_farve == "gul"}
              <li class="mb-4 marker:text-yellow-300">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a class="btn btn-xs btn-primary" target="_blank"'
                )}
              </li>
          {:else if aktuelt.punkt_farve == "grå"}
              <li class="mb-4 marker:text-grey-300">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a class="btn btn-xs btn-primary" target="_blank"'
                )}
              </li>
          {:else}
              <li class="mb-4 marker:text-green-400"> 
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a class="btn btn-xs btn-primary" target="_blank"'
                )}
              </li>               
          {/if}
        {/each}
      </ul>
    </div>
    <div class="rounded-lg bg-base-300 p-4 shadow-lg h-96 overflow-y-scroll">
      <h2 class="text-2xl font-bold mb-4">Kommende moduler</h2>
      {#each $forside.skema as modul}
        <a class={colorModul(modul)} href="/modul/?absid={modul['absid']}">
          {#if modul["navn"]}
            {#if modul["andet"]}
              <div class="tooltip flex justify-center" data-tip="Har indhold">
                <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-bookmark-fill ml-4 mt-1"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
                  />
                </svg>
              </div>
            {:else}
              <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
            {/if}
          {:else}
            <h1 class="text-xl font-bold">{modul["hold"]}</h1>
          {/if}
          <h1 class="text-sm font-bold">{modul["tidspunkt"]}</h1>
          {#if modul["lokale"]}
            <h1 class="text-sm font-bold">{modul["lokale"]}</h1>
          {/if}
        </a>
      {/each}
    </div>
    {#if $beskeder}
    <div class="rounded-lg xl:col-start-3 bg-base-300 p-4 pb-0 shadow-lg h-96 overflow-y-scroll">
      <h2 class="text-2xl font-bold mb-4">Beskeder</h2>
      {#each $beskeder["beskeder"] as besked}
        <a href="/besked?id={besked["message_id"]}">
          <div class="mb-4 rounded-lg bg-neutral p-4">
            <p class="text-xl font-bold text-neutral-content">{besked["emne"]}</p>
            <p class="text-sm text-neutral-content">{besked["førsteBesked"]}</p>
            <p class="text-xs text-neutral-content">{besked["ændret"]}</p>
          </div>
        </a>
      {/each}
    </div>
    {/if}
    {#if $lektier}
      <div class="rounded-lg xl:col-start-3 bg-base-300 p-4 shadow-lg pb-0 h-96 overflow-y-scroll">
        <h2 class="text-2xl font-bold mb-4">Lektier</h2>
        {#each $lektier as lektie}
          <a href="/modul?absid={lektie.aktivitet.absid}">
            <div class="mb-4 rounded-lg bg-neutral p-4">
              <p class="text-xl font-bold text-neutral-content">
                <span class="font-bold"
                  >{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet
                    .hold}</span
                >
                ({lektie.aktivitet.tidspunkt})
              </p>
              <p class="text-neutral-content">{lektie.lektier.beskrivelse}</p>
            </div>
          </a>
        {/each}
      </div>
    {/if}
    {#if $nyheder}
      <div class="h-64 overflow-y-scroll xl:col-start-3 rounded-lg bg-base-300 p-4 pb-0 shadow-lg">
        <h2 class="mb-4 text-2xl font-bold">Nyheder</h2>
        {#each $nyheder as newsItem}
          <div class="mb-4 rounded-lg bg-neutral p-4">
            <h3 class="text-xl font-bold text-neutral-content">{newsItem.title}</h3>
            <p class="text-sm text-neutral-content">{newsItem.date}</p>
            <p class="text-neutral-content">{newsItem.body}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="h-96"></div>
</body>
