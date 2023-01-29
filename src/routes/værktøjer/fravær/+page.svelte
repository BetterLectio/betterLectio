<script>
  import { each } from "svelte/internal";
  import { get } from "../../../components/http";
  import { fravaer } from "../../../components/store";

  let desiredAmount = 10;
  let fravaerData = {};
  let fravaerType = "opgjort"
  get("/fravaer").then((data) => {
    $fravaer = data;
    getData()
  });

  getData()
  function getData(){
    $fravaer?.generalt.forEach((element) => {
    if (element.hold == "Samlet") {
      fravaerData.matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(element[fravaerType+"_fravær_moduler"]);
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

<label for="fravaerType" class="mb-2 block font-medium">Skal den udregne på baggrund af dit opgjorte fravær eller for hele året?</label>
<select on:change={getData} bind:value={fravaerType} id="fravaerType" class="select select-bordered w-full">
  <option value="opgjort">Opgjort</option>
  <option value="heleåret">Hele året</option>
</select>

<div class="flex">
<div class="w-full max-w-xl rounded-lg bg-base-200 p-4 shadow-md sm:p-6 md:p-8 m-2">
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