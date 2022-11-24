<script>
  import { get } from "../../components/http.js";
  import { mig } from "../../components/store.js";

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
</script>

<body>
  {#if $mig}
    <h1 class="text-3xl font-bold mb-4">{chosenGreeting}, {$mig.navn}</h1>
  {/if}
</body>
