<script>
  import { get } from "../../../components/http";
  import { fravaer } from "../../../components/store";

  let desiredAmount = 10;
  let fravaerData = {};
  let fravaerType = "Hele året";
  get("/fravaer").then((data) => {
    $fravaer = data;
    getData()
  });

  getData()
  function getData(){
    $fravaer?.generalt.forEach((element) => {
    if (element.hold == "Samlet") {
      fravaerData.matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(element[fravaerType.toLowerCase().replace(" ", "")+"_fravær_moduler"]);
      fravaerData.currentClasses = Number(fravaerData.matches[1].replace(",", "."));
      fravaerData.totalClasses = Number(fravaerData.matches[2]);
      fravaerData.currentFravær = (fravaerData.currentClasses / fravaerData.totalClasses) * 100;
      fravaerData.possibleAmount = Math.floor(fravaerData.totalClasses * (desiredAmount / 100));
    }
  });
  }


  const updateDesired = (e) => {
    fravaerData.possibleAmount = Math.floor(fravaerData.totalClasses * (desiredAmount / 100));
  };
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær Regner</h1>
<label for="procent-range" class="mb-2 block font-medium">Hvor meget procent fravær vil du ende med?</label>
<input on:input={updateDesired} bind:value={desiredAmount} id="procent-range" type="range"  class="range range-primary" />

<ul class="flex flex-wrap mt-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400">
  <li class="mr-2">
      <button on:click={() => {fravaerType = "Hele året"; getData()}} class="inline-block px-4 py-3 rounded-lg {fravaerType == "Hele året" ? "text-white bg-primary" : "hover:text-gray-900 hover:bg-primary-focus dark:hover:text-white"}">Hele året</button>
  </li>
  <li class="mr-2">
      <button on:click={() => {fravaerType = "Opgjort"; getData()}} class="inline-block px-4 py-3 rounded-lg {fravaerType == "Opgjort" ? "text-white bg-primary" : "hover:text-gray-900 hover:bg-primary-focus dark:hover:text-white"}">Opgjort</button>
  </li>
</ul>

<div class="flex">
<div class="w-full max-w-xl rounded-lg bg-base-200 p-4 shadow-md sm:p-6 md:p-8 mt-2">
  <h2 class="text-2xl font-bold">{fravaerType}</h2>

  {#if fravaerData}
    <p class="mt-2 text-xl lg:text-2xl">Du vil ende med <span class="font-bold">{desiredAmount}%</span> fravær</p>
    <p class="mt-2 text-xl lg:text-2xl">
      Så kan du i alt pjække <span class="font-bold">{fravaerData.possibleAmount.toLocaleString("da")}</span> moduler
    </p>
    {#if fravaerData.possibleAmount - fravaerData.currentClasses < 0}
      <p class="mt-2 text-xl lg:text-2xl">
        Du har allerede pjækket <span class="font-bold"
          >{Math.abs(fravaerData.possibleAmount - fravaerData.currentClasses).toLocaleString("da")}</span
        >
        moduler for meget
      </p>
    {:else}
      <p class="mt-2 text-xl lg:text-2xl">
        Du kan pjække <span class="font-bold"
          >{(fravaerData.possibleAmount - fravaerData.currentClasses).toLocaleString("da")}</span
        > moduler mere
      </p>
    {/if}
    <br />
    <p class="mt-2 text-2xl">Stats</p>
    <p class="mt-2 text-xl">
      Antal fraværende moduler: <span class="font-bold">{fravaerData.currentClasses.toLocaleString("da")}</span>
    </p>
    <p class="mt-2 text-xl">
      Totalt antal moduler: <span class="font-bold">{fravaerData.totalClasses.toLocaleString("da")}</span>
    </p>
    <p class="mt-2 text-xl">
      Fravær procent: <span class="font-bold">{fravaerData.currentFravær.toLocaleString("da")}%</span>
    </p>
  {/if}
</div>
</div>