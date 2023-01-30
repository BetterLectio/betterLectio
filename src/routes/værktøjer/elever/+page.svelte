<script>
  import BrugerPopup from "../../../components/BrugerPopup.svelte";
  import { get } from "../../../components/http";
  import { informationer } from "../../../components/store";

  let ready = false;
  let elevObjArray = [];
  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      elevObjArray.push({ navn: navn, id: value });
    }
    ready = true;
  });

  let searchString = "";
  function search() {
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
    elevObjArray = [];
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      if (navn.toLowerCase().includes(searchString.toLowerCase())) {
        elevObjArray.push({ navn: navn, id: value });
      }
    }
  }
</script>

<h1 class="mb-4 text-3xl font-bold">Elev liste</h1>

<input
  type="text"
  placeholder="Søg i elev liste"
  class="input-bordered input mb-4 w-full md:w-1/4"
  bind:value={searchString}
  on:input={search}
/>
<div class="">
  <table class="table table-zebra table-compact w-full">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>Navn</th>
      </tr>
    </thead>
    <tbody>
  {#if ready}
    {#each elevObjArray as elev, i}
      <tr>
        <th>{i}</th>
        <td><BrugerPopup navn={elev.navn} id={elev.id}>{elev.navn}</BrugerPopup></td>
      </tr>
    {/each}
  {/if}
</tbody>
</table>
</div>
