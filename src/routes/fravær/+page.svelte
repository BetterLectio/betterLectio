<script>
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";

  let samletFravaer = null;
  get("/fravaer").then((data) => {
    $fravaer = { sort: { col: "procent", ascending: true }, data };
    sort("procent"); // Altid sorter efter fravær procent først
    $fravaer.data.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        samletFravaer = parseFloat(element.fravær_procent);
      }
    });
  });

  $: sort = (column) => {
    if ($fravaer.sort.col == column) {
      $fravaer.sort.ascending = !$fravaer.sort.ascending;
    } else {
      $fravaer.sort.col = column;
      $fravaer.sort.ascending = true;
    }

    let sortModifier = $fravaer.sort.ascending ? 1 : -1;
    const parseProcent = (procent) => parseFloat(procent.replace(",", "."));
    let sortFunc = (a, b) => {
      switch (column) {
        case "procent":
          return parseProcent(a.fravær_procent) < parseProcent(b.fravær_procent) ? -1 * sortModifier : parseProcent(a.fravær_procent) > parseProcent(b.fravær_procent) ? 1 * sortModifier : 0;
        case "moduler":
          const aValue = /([0-9]+)\//g.exec(a.fravær_moduler)[1];
          const bValue = /([0-9]+)\//g.exec(b.fravær_moduler)[1];
          return aValue < bValue ? -1 * sortModifier : aValue > bValue ? 1 * sortModifier : 0;
        case "hold":
          return a.hold < b.hold ? -1 * sortModifier : a.hold > b.hold ? 1 * sortModifier : 0;
      }
    };
    $fravaer.data.generalt = $fravaer.data.generalt.sort(sortFunc);
  };

  $: sortArrow = (column, sort) => {
    if (column == sort.col) {
      return sort.ascending ? "▲" : "▼";
    } else {
      return "";
    }
  };
</script>

<h1 class="text-3xl font-bold">Fravær</h1>
{#if $fravaer?.data}
  {#if samletFravaer == 0}
    <p>Du har intet fravær</p>
  {:else}
    <p>Du har {samletFravaer}% fravær</p>
    <p>Hold uden fravær er ikke vist</p>
  {/if}

  <div class="mb-4 mt-4">
    <table class="table w-full rounded-xl shadow-xl">
      <thead>
        <tr>
          <th on:click={sort("hold")}>Hold {sortArrow("hold", $fravaer.sort)}</th>
          <th on:click={sort("procent")}>Fravær {sortArrow("procent", $fravaer.sort)}</th>
          <th on:click={sort("moduler")}>Moduler {sortArrow("moduler", $fravaer.sort)}</th>
        </tr>
      </thead>
      <tbody>
        {#each $fravaer.data.generalt as fravaer}
          {#if fravaer.hold != "Samlet" && fravaer.fravær_procent != "0,00%"}
            <tr>
              <td>{fravaer.hold}</td>
              <td>{fravaer.fravær_procent}</td>
              <td>{fravaer.fravær_moduler}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
{/if}
