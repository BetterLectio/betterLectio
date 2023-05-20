<script>
  import { get } from "$lib/js/http";
  import { fravaer } from "$lib/js/store";

  let desiredAmount = 10;
  let fravaerData = {};
  let fravaerType = "Opgjort";
  get("/fravaer").then((data) => {
    $fravaer = data;
    getData();
  });

  getData();
  function getData() {
    if ($fravaer?.generalt)
      $fravaer.generalt.forEach((element) => {
        if (element.hold == "Samlet") {
          fravaerData.matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(
            element[fravaerType.toLowerCase().replace(" ", "") + "_fravær_moduler"]
          );
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

<h1 class="heading">Fravær Regner</h1>

{#if !$fravaer}
  <p class="loading btn-ghost btn">Henter data...</p>
{:else}
  <label for="procent-range" class="mb-2 block font-medium">Hvor meget procent fravær vil du ende med?</label>
  <input on:input={updateDesired} bind:value={desiredAmount} id="procent-range" type="range" class="range range-primary" />

  <ul class="mt-2 flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400">
    <li class="mr-2">
      <button
        on:click={() => {
          fravaerType = "Hele året";
          getData();
        }}
        class="inline-block rounded-lg px-4 py-3 {fravaerType == 'Hele året'
          ? 'bg-primary text-white'
          : 'hover:bg-primary-focus hover:text-gray-900 dark:hover:text-white'}">Hele året</button
      >
    </li>
    <li class="mr-2">
      <button
        on:click={() => {
          fravaerType = "Opgjort";
          getData();
        }}
        class="inline-block rounded-lg px-4 py-3 {fravaerType == 'Opgjort'
          ? 'bg-primary text-white'
          : 'hover:bg-primary-focus hover:text-gray-900 dark:hover:text-white'}">Opgjort</button
      >
    </li>
  </ul>

  <div class="flex">
    <div class="mt-2 w-full max-w-xl rounded-lg bg-base-200 p-4 shadow-md sm:p-6 md:p-8">
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
            Du kan pjække <span class="font-bold">{(fravaerData.possibleAmount - fravaerData.currentClasses).toLocaleString("da")}</span> moduler
            mere
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
{/if}
