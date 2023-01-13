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
  <p>Vægtet gennemsnit: {$karakterer.gennemsnit}</p>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          {#each Object.entries($karakterer.karakterer[0]) as [key, value]}
            <th>{key}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
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
{/if}
