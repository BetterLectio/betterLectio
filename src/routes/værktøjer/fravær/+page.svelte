<script>
  import { each } from "svelte/internal";
  import { get } from "../../../components/http";
  import { fravaer } from "../../../components/store";

  let desiredAmount = 10;
  let heleAaret = {};
  let opgjort = {};
  get("/fravaer").then((data) => {
    $fravaer = data;
  });

  $: $fravaer?.generalt.forEach((element) => {
    if (element.hold == "Samlet") {
      heleAaret.matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(element.heleåret_fravær_moduler);
      heleAaret.currentClasses = Number(heleAaret.matches[1].replace(",", "."));
      heleAaret.totalClasses = Number(heleAaret.matches[2]);
      heleAaret.currentFravær = (heleAaret.currentClasses / heleAaret.totalClasses) * 100;
      heleAaret.possibleAmount = Math.floor(heleAaret.totalClasses * (desiredAmount / 100));

      opgjort.matches = /(\d+\,?\d*|\,\d+)\/(\d+\,?\d*|\,\d+)/g.exec(element.opgjort_fravær_moduler);
      opgjort.currentClasses = Number(opgjort.matches[1].replace(",", "."));
      opgjort.totalClasses = Number(opgjort.matches[2]);
      opgjort.currentFravær = (opgjort.currentClasses / opgjort.totalClasses) * 100;
      opgjort.possibleAmount = Math.floor(opgjort.totalClasses * (desiredAmount / 100));
    }
  });

  const updateDesired = (e) => {
    desiredAmount = e.target.value;
    heleAaret.possibleAmount = Math.floor(heleAaret.totalClasses * (desiredAmount / 100));
    opgjort.possibleAmount = Math.floor(opgjort.totalClasses * (desiredAmount / 100));
  };
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær Regner</h1>
<div class="w-full max-w-xl rounded-lg bg-base-200 p-4 shadow-md sm:p-6 md:p-8">
  <label for="procent-range" class="mb-2 block font-medium">Hvor meget procent fravær vil du ende med?</label>
  <input on:input={updateDesired} id="procent-range" type="range" value="10" class="range range-primary" />
  {#if heleAaret}
    <p class="mt-2 text-xl lg:text-2xl">Du vil ende med <span class="font-bold">{desiredAmount}%</span> fravær</p>
    <p class="mt-2 text-xl lg:text-2xl">
      Så kan du i alt pjække <span class="font-bold">{heleAaret.possibleAmount.toLocaleString("da")}</span> moduler
    </p>
    {#if heleAaret.possibleAmount - heleAaret.currentClasses < 0}
      <p class="mt-2 text-xl lg:text-2xl">
        Du har allerede pjækket <span class="font-bold"
          >{Math.abs(heleAaret.possibleAmount - heleAaret.currentClasses).toLocaleString("da")}</span
        >
        moduler for meget
      </p>
    {:else}
      <p class="mt-2 text-xl lg:text-2xl">
        Du kan pjække <span class="font-bold"
          >{(heleAaret.possibleAmount - heleAaret.currentClasses).toLocaleString("da")}</span
        > moduler mere
      </p>
    {/if}
    <br />
    <p class="mt-2 text-2xl">Stats</p>
    <p class="mt-2 text-xl">
      Antal fraværende moduler: <span class="font-bold">{heleAaret.currentClasses.toLocaleString("da")}</span>
    </p>
    <p class="mt-2 text-xl">
      Totalt antal moduler: <span class="font-bold">{heleAaret.totalClasses.toLocaleString("da")}</span>
    </p>
    <p class="mt-2 text-xl">
      Fravær procent: <span class="font-bold">{heleAaret.currentFravær.toLocaleString("da")}%</span>
    </p>
  {/if}
</div>
