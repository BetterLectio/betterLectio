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
          {#if $karakterer.oversigt.karakterblad.gennemsnit}
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
          {:else}
            <p class="mt-4">Du har intet karaktergennemsnit på nuværende tidspunkt.</p>
          {/if}
        </div>
        <div class="mt-4 w-1/2 overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
          <h2 class="mb-4 text-2xl font-bold">Afsluttede fag gennemsnit</h2>
          {#if $karakterer.oversigt.karakterblad.gennemsnit}
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
          {:else}
            <p>Du har intet karaktergennemsnit på nuværende tidspunkt.</p>
          {/if}
        </div>
      </div>
    </div>

    <!-- KARAKTERBLAD -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Karakterblad</h1>
      <div class="overflow-x-auto">
        {#if $karakterer.protokollinjer.length > 0}
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
        {:else}
          <p>Du har ingen karakterer på nuværende tidspunkt.</p>
        {/if}
      </div>
    </div>

    <!-- KARAKTERNOTER -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Karakternoter</h1>
      <div class="flex w-full flex-col overflow-x-auto">
        {#if $karakterer.karakternoter.length > 0}
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
        {:else}
          <p>Du har ingen karakternoter på nuværende tidspunkt.</p>
        {/if}
      </div>
    </div>

    <!-- AFSLUTTEDE FAG -->
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Afsluttede fag</h1>
      <div class="flex w-full flex-col overflow-x-auto">
        {#if $karakterer.protokollinjer.length > 0}
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
        {:else}
          <p>Du har ikke afsluttet nogen fag.</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center">
      <div
        class="radial-progress text-center"
        style="--value:{(($karakterer.oversigt.karakterblad.gennemsnit + 3) / 15) * 100}; --size:12rem; --thickness: 1rem;"
      >
        <p>Gennemsnit</p>
        <p class="text-3xl font-bold">{$karakterer.oversigt.karakterblad.gennemsnit.toFixed(2).replace(".", ",")}</p>
      </div>
    </div>
    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Karakterblad</h1>
      <div class="overflow-x-auto">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              <th>Fag</th>
              <th>Karakter</th>
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.karakterblad as karakter}
              <tr>
                <td>{karakter.fag}, {karakter.evalueringsform}</td>
                <td>{karakter.karakter}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
{/if}
