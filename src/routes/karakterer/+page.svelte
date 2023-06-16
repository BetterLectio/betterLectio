<script>
  import { get } from "$lib/js/http.js";
  import { karakterer } from "$lib/js/store.js";

  get("/karakterer").then((data) => {
    $karakterer = data;
  });
</script>

<h1 class="heading">Karakterer</h1>

{#if $karakterer}
  {#if window.innerWidth > 768}
    <!-- KARAKTEROVERSIGT -->
    <div class="rounded-lg bg-base-200 p-4 lg:flex-row">
      <h1 class="pb-2 text-2xl font-bold">Karakteroversigt</h1>
      <div class="flex w-full flex-col lg:flex-row">
        <div class="w-full rounded-lg bg-base-300 p-4 lg:w-1/2">
          <h2 class="text-2xl font-bold">Gennemsnit</h2>
          <div class="mt-4 stats mb-4 bg-base shadow">
            <div class="stat">
              <div class="stat-title">Vægtet gennemsnit</div>
              <div class="stat-value">{$karakterer.oversigt.karakterblad.gennemsnit.toFixed(2).replace(".", ",")}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Antal karakterer</div>
              <div class="stat-value">{$karakterer.oversigt.karakterblad.karakterer}</div>
            </div>
          </div>
        </div>
        <div class="mt-4 w-1/2 overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
          <h2 class="mb-4 text-2xl font-bold">Afsluttede fag gennemsnit</h2>
          <div class="stats mb-4 bg-base shadow">
            <div class="stat">
              <div class="stat-title">Vægtet gennemsnit</div>
              <div class="stat-value">{$karakterer.oversigt.protokollinjer.gennemsnit.toFixed(2).replace(".", ",")}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Antal afsluttede karakterer</div>
              <div class="stat-value">{$karakterer.oversigt.protokollinjer.karakterer}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KARAKTERBLAD -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Karakterblad</h1>
      <div class="overflow-x-auto">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              {#each Object.keys($karakterer.karakterblad[0]) as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.karakterblad as karakter}
              <tr>
                {#each Object.values(karakter) as value}
                  <td>{value}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- KARAKTERBLAD -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Karakternoter</h1>
      <div class="flex w-full flex-col overflow-x-auto">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              {#each Object.keys($karakterer.karakternoter[0]) as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.karakternoter as note}
              <tr>
                {#each Object.values(note) as value}
                  {#if typeof value === "string"}
                    <td class="whitespace-pre-wrap">{value}</td>
                  {:else}
                    <td><a class="btn-primary btn-xs btn" href="skema?id={value.id}">{value.navn}</a></td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- AFSLUTTEDE FAG -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Afsluttede fag</h1>
      <div class="flex w-full flex-col overflow-x-auto">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              {#each Object.keys($karakterer.protokollinjer[0]) as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.protokollinjer as karakter}
              <tr>
                {#each Object.values(karakter) as value}
                  {#if typeof value === "string"}
                    <td>{value}</td>
                  {:else if value.id.indexOf("XF") !== -1}
                    <td>{value.navn}</td>
                  {:else}
                    <td><a class="btn-primary btn-xs btn" href="skema?id={value.id}">{value.navn}</a></td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
{/if}
