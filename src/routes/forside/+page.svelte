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


</script>

<body>
  <!-- greeting -->
  {#if $brugeren}
    <h1 class="mb-4 text-3xl font-bold">{getGreeting()}, {$brugeren.navn}</h1>
  {/if}

  <!-- main content -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div class="bg-base-300 rounded-lg shadow-lg p-4 md:col-span-2">
      <h2 class="text-2xl font-bold">Aktuelt</h2>
      <p>Kommer snart</p>
    </div>
    <div class="bg-base-300 rounded-lg shadow-lg p-4">
      <h2 class="text-2xl font-bold">Skema for idag</h2>
      <p>Kommer snart</p>
    </div>
    <div class="bg-base-300 rounded-lg shadow-lg p-4">
      <h2 class="text-2xl font-bold">beskeder</h2>
      <p>Kommer snart</p>
    </div>
    <div class="bg-base-300 rounded-lg shadow-lg p-4">
      <h2 class="text-2xl font-bold">lektier</h2>
      <p>Kommer snart</p>
    </div>
    <div class="bg-base-300 rounded-lg shadow-lg p-4">
      <h2 class="text-2xl font-bold">Nyheder</h2>
      <p>Kommer snart</p>
    </div>

  </div>
</body>
