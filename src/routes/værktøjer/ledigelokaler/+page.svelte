<script>
  import { get } from "../../../components/http.js";
  import { lokaler } from "../../../components/store.js";

  get("/ledige_lokaler").then((data) => {
    $lokaler = data.filter((lokale) => lokale.status == "ledigt");
  });
</script>

<ul class="list">
  <h1 class="pb-2 text-2xl font-bold">Ledige lokaler</h1>
  {#if $lokaler}
    {#if $lokaler.length == 0}
      <p class="text-lg">Ingen ledige lokaler</p>
    {:else}
      {#each $lokaler as lokale}
        <li class="element flex justify-between">
          <p class="text-lg font-bold">{lokale.lokale}</p>
          <p class="text-base">{lokale.status}</p>
        </li>
      {/each}
    {/if}
  {:else}
    <p class="text-lg">Henter ledige lokaler...</p>
  {/if}
</ul>
