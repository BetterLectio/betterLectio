<script>
  import { get } from "../../../components/http";

  let desiredAmount = 10;
  let totalClasses = 0;
  let currentClasses = "0";
  let currentFravær = 0;
  let possibleAmount = 0;
  get("/fravaer").then((data) => {
    data.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        const matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(element.fravær_moduler);
        currentClasses = matches[1];
        totalClasses = matches[2];
        currentFravær = ((currentClasses.replace(",", ".") / totalClasses) * 100).toPrecision(3);
        possibleAmount = Math.floor(totalClasses * (desiredAmount / 100));
      }
    });
  });

  const updateDesired = (e) => {
    desiredAmount = e.target.value;
    possibleAmount = Math.floor(totalClasses * (desiredAmount / 100));
  };
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær Regner</h1>
<div class="w-full max-w-xl rounded-lg bg-base-200 p-4 shadow-md sm:p-6 md:p-8">
  <label for="procent-range" class="mb-2 block font-medium">Hvor meget procent fravær vil du ende med?</label>
  <input on:input={updateDesired} id="procent-range" type="range" value="10" class="range range-primary" />
  <p class="mt-2 text-xl lg:text-2xl">Du vil ende med <span class="font-bold">{desiredAmount}%</span> fravær</p>
  <p class="mt-2 text-xl lg:text-2xl">Så kan du i alt pjekke <span class="font-bold">{possibleAmount}</span> moduler</p>
  {#if possibleAmount - currentClasses.replace(",", ".") < 0}
    <p class="mt-2 text-xl lg:text-2xl">
      Du har allerede pjekket <span class="font-bold">{Math.abs(possibleAmount - currentClasses.replace(",", "."))}</span> moduler
      for meget
    </p>
  {:else}
    <p class="mt-2 text-xl lg:text-2xl">
      Du kan pjekke <span class="font-bold">{possibleAmount - currentClasses.replace(",", ".")}</span> moduler mere
    </p>
  {/if}
  <br />
  <p class="mt-2 text-2xl">Stats</p>
  <p class="mt-2 text-xl">Antal fraværende moduler: <span class="font-bold">{currentClasses}</span></p>
  <p class="mt-2 text-xl">Totalt antal moduler: <span class="font-bold">{totalClasses}</span></p>
  <p class="mt-2 text-xl">Fravær procent: <span class="font-bold">{currentFravær}%</span></p>
</div>
