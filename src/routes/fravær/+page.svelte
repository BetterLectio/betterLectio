<script>
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";
  import Table from "../../components/Table.svelte";
  import table from "markdown-it/lib/rules_block/table";
  let samletFravaer = null;
  get("/fravaer").then((data) => {
    $fravaer = data;
    $fravaer.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        samletFravaer = parseFloat(element.fravær_procent);
      }
    });
  });
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær</h1>
{#if $fravaer}
  {#if samletFravaer == 0}
    <p class="m-4">Du har intet fravær</p>
  {:else}
    <p class="m-4">Du har {samletFravaer}% fravær</p>
  {/if}

  <table class="table-zebra table shadow-xl">
    <thead>
      <tr>
        <th>Hold</th>
        <th>Fravær</th>
      </tr>
    </thead>
    <tbody>
      {#each $fravaer.generalt as fravaer}
        {#if fravaer.hold != "Samlet" && fravaer.fravær_procent != "0,00%"}
          <tr>
            <td>{fravaer.hold}</td>
            <td>{fravaer.fravær_procent}</td>
          </tr>
        {/if}
      {/each}
      <tr>
        <td>Rækker uden fravær er ikke vist</td>
      </tr>
    </tbody>
  </table>
{/if}
