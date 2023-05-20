<script>
  import { get } from "$lib/js/http.js";
  import { karakterer } from "$lib/js/store.js";

  get("/karakterer").then((data) => {
    let karaktererSum = 0;
    let karaktererVægtningSum = 0;
    data.protokollinjer.forEach((karakter) => {
      if (karakter.medtæller == "Ja" && karakter.karakter != "--") {
        karaktererSum += parseFloat(karakter.karakter) * parseFloat(karakter.vægt.replace(",", "."));
        karaktererVægtningSum += parseFloat(karakter.vægt.replace(",", "."));
      }
    });
    $karakterer = {
      gennemsnit: karaktererSum / karaktererVægtningSum,
      karakterer: data,
    };
  });
</script>

<h1 class="heading">Karakterer</h1>

{#if $karakterer}
  {#if window.innerWidth > 768}
    <!--
      Udkommenteret indtil videre. Bliver nødt til at vente til resten af karaktererne bliver frigivet så jeg ved hvordan jeg kender forskel.

    <div class="bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Afsluttende karakterblad (WIP)</h1>
      <div class="flex w-full flex-col lg:flex-row">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                {#each Object.entries($karakterer.karakterer.protokollinjer[0]) as [key, value]}
                  <th>{key}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each $karakterer.karakterer.protokollinjer as karakter}
                <tr>
                  {#each Object.entries(karakter) as [key, value]}
                    <td>{value}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-4 stats mb-4 bg-base shadow">
        <div class="stat">
          <div class="stat-title">Vægtet gennemsnit</div>
          <div class="stat-value">{$karakterer.gennemsnit}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Antal Færdige Eksamener</div>
          <div class="stat-value">{$karakterer.karakterer.protokollinjer.length}</div>
        </div>
      </div>
    </div>
    -->

    <!--
      Bliver nødt til at vente til resten af karaktererne bliver frigivet så jeg ved hvordan jeg kender forskel:
      <div class="flex w-full flex-col rounded-lg bg-base-200 p-4 lg:flex-row">
        <div class="w-full rounded-lg bg-base-300 p-4 lg:w-1/2">
          <h2 class="text-2xl font-bold">Standpunkt</h2>
        </div>
        <div class="mt-4 w-1/2 overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
          <h2 class="mb-4 text-2xl font-bold">Eksamener</h2>
        </div>
        <div class="mt-4 w-1/2 overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
          <h2 class="mb-4 text-2xl font-bold">Afsluttende gennemsnit</h2>
        </div>
      </div>      
    -->

    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Alle karakterer</h1>
      <div class="overflow-x-auto">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              {#each $karakterer.karakterer.karakterer.headers as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.karakterer.karakterer.grades as karakter}
              <tr>
                <td><a class="btn-primary btn-xs btn" href="skema?id={karakter.hold.id}">{karakter.hold.navn}</a></td>
                <td>{karakter.fag}</td>
                {#each karakter.grades as grade}
                  <td>{grade}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4 bg-base-300 rounded-lg p-4">
      <h1 class="pb-2 text-2xl font-bold">Eksamener</h1>
      <div class="flex w-full flex-col lg:flex-row">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                {#each Object.entries($karakterer.karakterer.protokollinjer[0]) as [key, value]}
                  <th>{key}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each $karakterer.karakterer.protokollinjer as karakter}
                <tr>
                  {#each Object.entries(karakter) as [key, value]}
                    <td>{value}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-4 stats mb-4 bg-base shadow">
        <div class="stat">
          <div class="stat-title">Vægtet gennemsnit</div>
          <div class="stat-value">{$karakterer.gennemsnit}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Antal Færdige Eksamener</div>
          <div class="stat-value">{$karakterer.karakterer.protokollinjer.length}</div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center">
      <div
        class="radial-progress text-center"
        style="--value:{(($karakterer.gennemsnit + 3) / 15) * 100}; --size:12rem; --thickness: 1rem;"
      >
        <p>Gennemsnit</p>
        <p class="text-3xl font-bold">{Math.round($karakterer.gennemsnit * 100) / 100}</p>
      </div>
    </div>
    <div class="mt-4 overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Prøve</th>
            <th>Karakter</th>
          </tr>
        </thead>
        <tbody>
          {#each $karakterer.karakterer.protokollinjer as karakter}
            <tr>
              <td>{karakter.xprs_fag.split("- ").at(-1)}</td>
              <td>{karakter.karakter}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
{/if}
