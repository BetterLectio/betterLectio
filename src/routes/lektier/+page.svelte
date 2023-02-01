<script>
  import { get } from "../../components/http.js";
  import { lektier } from "../../components/store.js";

  get("/lektier").then((data) => {
    $lektier = data;
  });

  function separateAssignmentsByDays() {
    let datoer = [];
    $lektier.forEach((lektie) => {
      if (!datoer.includes(lektie.aktivitet.tidspunkt.split(" ")[0])) {
        datoer.push(lektie.aktivitet.tidspunkt.split(" ")[0]);
      }
      console.log(datoer);
    });
    return datoer;
  }

  $: separateAssignmentsByDays();
</script>

<body>
  <h1 class="text-3xl font-bold">Lektier</h1>
  <h3 class="mb-4 text-xl">Her kan du se dine lektier for de kommende 14 dage</h3>
  {#if $lektier.length > 0}
    {#each Object.values(separateAssignmentsByDays()) as datoer}
      <h2 class="mb-2 mt-4 text-lg font-bold">{datoer}</h2>
      <ul class="list">
        {#each $lektier as lektie}
          {#if lektie.aktivitet.tidspunkt.split(" ")[0] == datoer}
            <a href="/modul?absid={lektie.aktivitet.absid}">
              <li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4">
                <div>
                  <p>
                    <span class="font-bold"
                      >{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet.hold}</span
                    >
                    ({lektie.aktivitet.tidspunkt})
                  </p>
                  <p>{lektie.lektier.beskrivelse}</p>
                </div>
              </li>
            </a>
          {/if}
        {/each}
      </ul>
    {/each}
  {:else}
    <p>Du har ingen kommende lektier de næste 14 dage</p>
  {/if}
</body>
