<script>
  import { brugeren } from "../../components/store.js";
  import { get } from "../../components/http.js";

  get("/mig").then((data) => {
    $brugeren = data;
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

  let news;
  fetch("https://raw.githubusercontent.com/BetterLectio/news/main/news.json").then((response) => {
    return response.json();
  }).then((data) => {
    news = data["news"];
  });
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
    <div class="rounded-lg bg-base-300 p-4 shadow-lg">
      <h2 class="text-2xl font-bold">beskeder</h2>
      <p>Kommer snart</p>
    </div>
    <div class="rounded-lg bg-base-300 p-4 shadow-lg">
      <h2 class="text-2xl font-bold">lektier</h2>
      <p>Kommer snart</p>
    </div>
    <div class="rounded-lg bg-base-300 p-4 pb-0 shadow-lg h-64 overflow-y-hidden  hover:overflow-y-scroll">
      <h2 class="text-2xl font-bold mb-4">Nyheder</h2>
      {#if news}
        {#each news as newsItem}
          <div class="mb-4 bg-neutral rounded-lg p-4">
            <h3 class="text-xl font-bold text-neutral-content">{newsItem.title}</h3>
            <p class="text-sm text-neutral-content">{newsItem.date}</p>
            <p class="text-neutral-content">{newsItem.body}</p>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</body>
