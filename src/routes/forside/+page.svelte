<script>
  import { brugeren, nyheder, lektier, forside, skema } from "$lib/js/store.js";
  import { get } from "$lib/js/http.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";
  import { stringify } from "postcss";

  const md = new MarkdownIt();

  get("/mig").then((data) => {
    $brugeren = data;
  });

  get("/forside").then((data) => {
    $forside = data;
  });

  get("/lektier").then((data) => {
    $lektier = data;
  });

  const colorDict = {
    rød: "red-400",
    gul: "yellow-300",
    grå: "grey-300",
    grøn: "green-400",
  };

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
    let alldayGreetings = ["Velkommen tilbage", "Hejsa", "Velkommen"];
    let morningGreetings = ["Go' morgen", "Godmorgen"];
    let afternoonGreetings = ["God eftermiddag"];
    let eveningGreetings = ["Tak for i dag", "Godnat", "sov godt"];
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

  <h1 class="mb-4 text-3xl font-bold">
    {getGreeting()},
    {#if $brugeren}
      {$brugeren.navn}
    {/if}
  </h1>

  <!-- main content -->
  <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <ul class="list p-4 shadow-lg md:col-span-2 xl:row-span-4">
      <h2 class="mb-4 text-2xl font-bold">Aktuelt</h2>
      {#if $forside}
        {#each $forside["aktuelt"] as aktuelt}
          {#if aktuelt.punkt_farve == "rød"}
            <li class="element border-l-4 border-l-red-400">
              <div class="">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a data-sveltekit-preload-data class="btn btn-xs btn-primary" target="_blank"'
                )}
              </div>
            </li>
          {:else if aktuelt.punkt_farve == "gul"}
            <li class="element border-l-4 border-l-yellow-300">
              <div class="">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary" target="_blank"'
                )}
              </div>
            </li>
          {:else if aktuelt.punkt_farve == "grå"}
            <li class="element">
              <div class="">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary" target="_blank"'
                )}
              </div>
            </li>
          {:else}
            <li class="element border-l-4 border-l-green-400">
              <div class="">
                {@html sanitizeHtml(md.render(aktuelt.text.replaceAll("\n", "  \n"))).replaceAll(
                  "<a",
                  '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary" target="_blank"'
                )}
              </div>
            </li>
          {/if}
        {/each}
      {/if}
    </ul>
    <ul class="list max-h-96">
      <h2 class="mb-4 text-2xl font-bold">Kommende moduler</h2>
      {#if $forside?.skema.length > 0}
        {#each $forside.skema as modul}
          <a data-sveltekit-preload-data class={colorModul(modul)} href="/modul/?absid={modul['absid']}">
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
                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
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
      {:else}
        <p class="mb-4">Ingen kommende moduler</p>
      {/if}
    </ul>
    <div class="list max-h-96">
      <h2 class="mb-4 text-2xl font-bold">Ulæste beskeder</h2>
      {#if $forside?.kommunikation.beskeder.length > 0}
        {#each $forside.kommunikation.beskeder as besked}
          <a data-sveltekit-preload-data href="/besked?id={besked['id']}">
            <div class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4">
              <p class="text-xl font-bold">{besked["navn"]}</p>
              <p class="text-sm">{besked["afsender"]}</p>
              <p class="text-xs">{besked["dato"]}</p>
            </div>
          </a>
        {/each}
      {:else}
        <p class="mb-4">Ingen ulæste beskeder</p>
      {/if}
    </div>
    <ul class="list max-h-96">
      <h2 class="mb-4 text-2xl font-bold">Lektier</h2>
      {#if $lektier?.length > 0}
        {#each $lektier as lektie}
          <a data-sveltekit-preload-data href="/modul?absid={lektie.aktivitet.absid}">
            <li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4">
              <p class="text-xl font-bold">
                <span class="font-bold">{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet.hold}</span>
                ({lektie.aktivitet.tidspunkt})
              </p>
              <p>{lektie.lektier.beskrivelse}</p>
            </li>
          </a>
        {/each}
      {:else}
        <p class="mb-4">Ingen ulæste beskeder</p>
      {/if}
    </ul>
    <ul class="list max-h-96">
      <h2 class="mb-4 text-2xl font-bold">Nyheder</h2>
      {#if $nyheder}
        {#each $nyheder as newsItem}
          <li class="element">
            <h3 class="text-xl font-bold">{newsItem.title}</h3>
            <p class="text-sm">{newsItem.date}</p>
            <p>{newsItem.body}</p>
            <!--if the newsItem has a link then use it-->
            {#if newsItem.link}
              <a data-sveltekit-preload-data href={newsItem.link} target="_blank" rel="noreferrer" class="btn-primary btn-sm btn mt-2"
                >{newsItem.linkText}</a
              >
            {/if}
          </li>
        {/each}
      {:else}
        <p class="mb-4">Ingen nyheder</p>
      {/if}
    </ul>
  </div>
</body>
