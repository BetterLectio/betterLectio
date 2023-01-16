<script>
  import { get } from "../../components/http.js";
  import { karakterer } from "../../components/store.js";

  get("/karakterer").then((data) => {
    let karaktererSum = 0;
    let karaktererVægtningSum = 0;
    data.forEach((karakter) => {
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

<h1 class="pb-2 text-2xl font-bold">Karakterer</h1>
{#if $karakterer}
    {#if window.innerWidth > 768}
      <p>Vægtet gennemsnit: {Math.round($karakterer.gennemsnit * 100) / 100}</p>
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              {#each Object.entries($karakterer.karakterer[0]) as [key, value]}
                <th>{key}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $karakterer.karakterer as karakter}
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
        <div class="radial-progress text-center" style="--value:{($karakterer.gennemsnit+3)/15*100}; --size:12rem; --thickness: 1rem;">
          <p>Gennemsnit</p>
          <p class="font-bold text-3xl">{Math.round($karakterer.gennemsnit * 100) / 100}</p>
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
              {#each $karakterer.karakterer as karakter}
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
