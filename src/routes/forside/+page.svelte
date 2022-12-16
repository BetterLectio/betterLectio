<script>
  import { brugeren, nyheder, lektier, beskeder } from "../../components/store.js";
  import { get } from "../../components/http.js";

  get("/mig").then((data) => {
    $brugeren = data;
  });

  get("/beskeder").then((data) => {
    $beskeder = data;
  });

  get("/lektier").then((data) => {
    $lektier = data;
  });

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
    <div class="rounded-lg bg-base-300 p-4 shadow-lg md:col-span-2">
      <h2 class="text-2xl font-bold">Aktuelt</h2>
      <p>Kommer snart</p>
    </div>
    <div class="rounded-lg bg-base-300 p-4 shadow-lg">
      <h2 class="text-2xl font-bold">Skema for idag</h2>
      <p>Kommer snart</p>
    </div>
    {#if $beskeder}
    <div class="rounded-lg bg-base-300 p-4 pb-0 shadow-lg h-96 overflow-y-scroll">
      <h2 class="text-2xl font-bold mb-4">beskeder</h2>
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
      <div class="rounded-lg bg-base-300 p-4 shadow-lg pb-0">
        <h2 class="text-2xl font-bold mb-4">lektier</h2>
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
      <div class="h-64 overflow-y-scroll rounded-lg bg-base-300 p-4 pb-0 shadow-lg">
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
</body>
