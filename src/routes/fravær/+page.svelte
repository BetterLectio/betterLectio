<script>
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";

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

<h1 class="text-3xl font-bold">Fravær</h1>
{#if $fravaer}
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
      </tbody>
    </table>
  </div>
{/if}
