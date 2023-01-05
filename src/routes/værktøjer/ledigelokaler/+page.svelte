<script>
  import { get } from "../../../components/http.js";
  import { lokaler } from "../../../components/store.js";

  get("/ledige_lokaler").then((data) => {
    let _lokaler = {"ledige": [], "optagede": []};
    data.forEach(lokale => {
      if (lokale.status == "ledigt") {
        _lokaler.ledige.push(lokale);
      } else if (lokale.status == "optaget") {
        _lokaler.optagede.push(lokale);
      }
    });
    $lokaler = _lokaler;
  });
</script>

{#if $lokaler}
  <ul class="list mb-4">
    <h1 class="pb-2 text-2xl font-bold">Ledige lokaler</h1>
    {#each $lokaler.ledige as lokale}
      <li class="flex md:justify-between btn btn-success h-fit scale-99 hover:scale-100 mb-2">
        <p class="text-lg font-bold">{lokale.lokale}</p>
      </li>
    {/each}
    {#if $lokaler.ledige.length == 0}
      <p class="mb-2">Der er ingen optagede lokaler!</p>
    {/if}
  </ul>

  <ul class="list mb-4">
    <h1 class="pb-2 text-2xl font-bold">Optagede lokaler</h1>
    {#each $lokaler.optagede as lokale}
      <li class="flex justify-between btn btn-error h-fit scale-99 hover:scale-100 mb-2">
        <p class="text-lg font-bold">{lokale.lokale}</p>
      </li>
    {/each}
    {#if $lokaler.optagede.length == 0}
      <p class="mb-2">Der er ingen optagede lokaler!</p>
    {/if}
  </ul>
{/if}