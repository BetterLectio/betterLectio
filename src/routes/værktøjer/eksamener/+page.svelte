<script>
  import { get } from "$lib/js/http.js";
  import { eksamener } from "$lib/js/store.js";

  get("/eksamener").then((data) => {
    $eksamener = data;
  });
</script>

<h1 class="pb-2 text-2xl font-bold">Eksamener</h1>
{#if $eksamener}
  {#if $eksamener.exams.length === 0}
    <p class="mb-4">Du har ingen eksamener foran dig</p>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            {#each $eksamener.headers as header}
              <th>{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each $eksamener.exams as eksamen}
            <tr>
              {#each eksamen as dataPoint}
                <td>{dataPoint}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
{/if}
