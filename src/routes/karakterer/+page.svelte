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

<h1 class="mb-4 text-3xl font-bold">Karakterer</h1>
{#if $karakterer}
  {#if window.innerWidth > 768}
    <div class="stats mb-4 bg-base-200 shadow">
      <div class="stat">
        <div class="stat-title">Vægtet gennemsnit</div>
        <div class="stat-value">{$karakterer.gennemsnit}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Antal Færdige Eksamener</div>
        <div class="stat-value">{$karakterer.karakterer.protokollinjer.length}</div>
      </div>
    </div>

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
