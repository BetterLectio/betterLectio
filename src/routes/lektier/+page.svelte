<script>
  /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
  import { get } from "../../components/http.js";
  import { lektier } from "../../components/store.js";

  get("/lektier").then((data) => {
    $lektier = data;
  });
</script>

<body>
  <h1 class="text-3xl font-bold">Lektier</h1>
  <h3 class="mb-4 text-xl">Her kan du se dine lektier for de kommende 14 dage</h3>
  <ul class="list">
    {#if $lektier}
      {#each $lektier as lektie}
        <li class="element">
          <a href="/modul?absid={lektie.aktivitet.absid}">
            <div>
              <p>
                <span class="font-bold"
                  >{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet
                    .hold}</span
                >
                ({lektie.aktivitet.tidspunkt})
              </p>
              <p>{lektie.lektier.beskrivelse}</p>
            </div>
          </a>
        </li>
      {/each}
    {/if}
  </ul>
</body>
