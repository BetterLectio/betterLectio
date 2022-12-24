<script>
  import { get } from "../../../components/http.js";
  import { lokaler } from "../../../components/store.js";

  get("/ledige_lokaler").then((data) => {
    $lokaler = data;
  });
</script>

<ul class="list">
  <h1 class="pb-2 text-2xl font-bold">Ledige lokaler</h1>
  {#each $lokaler as lokale}
    {#if lokale.status == "ledigt"}
      <li class="element flex justify-between">
        <p class="text-lg font-bold">{lokale.lokale}</p>
        <p class="text-sm">{lokale.status}</p>
      </li>
    {/if}
  {/each}
</ul>
