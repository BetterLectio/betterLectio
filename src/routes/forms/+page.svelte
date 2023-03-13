<script>
  import { identity } from "svelte/internal";
  import { get } from "../../components/http";
  import { spørgeskemaer } from "../../components/store";

  let ready = false;

  let åbneForBesvarelse = [];
  let åbenForRapportering = [];

  get("/spoergeskemaer").then((data) => {
    $spørgeskemaer = data;
    åbneForBesvarelse = $spørgeskemaer.åbne_for_besvarelse;
    åbenForRapportering = $spørgeskemaer.åben_for_rapportering;

    ready = true;
  });
</script>

<div class="flex flex-row justify-between">
  <h1 class="mb-4 text-3xl font-bold">Spørgeskemaer</h1>
  <!--prettier-ignore-->
  <a href="/forms/lav" class="btn-success btn-sm btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>Nyt</a>
</div>

{#if ready}
  {#if $spørgeskemaer.åbne_for_besvarelse.length > 0}
    <ul>
      {#each $spørgeskemaer.åbne_for_besvarelse as spørgeskema}
        <a href="/forms/besvar?id={spørgeskema.id}">
          <li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4">
            <div>
              <div class="flex w-full flex-row justify-between">
                <p>
                  <span class="font-bold">{spørgeskema.titel}</span>
                </p>
                <p class="font-light opacity-50">
                  {"Svarfrist - " + spørgeskema.svarfrist}
                </p>
              </div>
              <p>{spørgeskema.ejer}</p>
            </div>
          </li>
        </a>
      {/each}
    </ul>
  {/if}
{:else}
  <div class="loading btn-ghost btn">Indlæser</div>
{/if}
