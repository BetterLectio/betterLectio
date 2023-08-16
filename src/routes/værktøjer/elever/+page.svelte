<script>
  import BrugerPopup from "$lib/components/BrugerPopup.svelte";
  import { get } from "$lib/js/http";
  import { informationer } from "$lib/js/store";

  let ready = false;
  let elevObjArray = [];
  get("/informationer").then(async (data) => {
    $informationer = await data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key;
      _elever[navn] = await value;
    }
    $informationer.lærereOgElever = await { ...$informationer.lærere, ..._elever };
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key;
      elevObjArray.push({ navn: navn, id: value });
    }
    ready = true;
  });

  let searchString = "";
  function search() {
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn;
      try {
        navn = key.split("(")[1].split(" ");
        navn.pop();
        navn = `${key.split("(")[0]}(${navn.join(" ")})`;
        _elever[navn] = value;
      } catch (error) {
        navn = key;
        console.warn("Can't spilt name:" + key);
      }
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
    elevObjArray = [];
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn;
      try {
        navn = key.split("(")[1].split(" ");
        navn.pop();
        navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      } catch (error) {
        navn = key;
        console.warn("Can't spilt name:" + key);
      }
      if (navn.toLowerCase().includes(searchString.toLowerCase())) {
        elevObjArray.push({ navn: navn, id: value });
      }
    }
  }
</script>

<h1 class="heading">Elevliste</h1>

<input
  type="text"
  placeholder="Søg i elevliste"
  class="input-bordered input mb-4 w-full md:w-1/4"
  bind:value={searchString}
  on:input={search}
/>
<div class="">
  <table class="table-zebra table-compact table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th />
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
