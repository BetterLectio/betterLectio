<script>
  import UgensSkema from "../../components/UgensSkema.svelte";
  import { addNotification } from "../../components/notifyStore";
  import { get } from "../../components/http.js";
  import { forside } from "../../components/store.js";
  addNotification("Skema siden er stadig under udvikling", "alert-warning")

  get("/forside").then((data) => {
    $forside = data;
  });

  function colorModul(modul) {
    let modulType = modul["status"];
    switch (modulType) {
      case "aflyst":
        return "btn btn-error mb-4 block h-fit p-2 normal-case";
      case "ændret":
        return "btn btn-success mb-4 block h-fit p-2 normal-case";
      case "normal":
        return "btn btn-info mb-4 block h-fit p-2 normal-case";
    }
  }
</script>

<h1 class="font-bold text-3xl mb-4">Skema</h1>

<div class="flex flex-col md:flex-row justify-between">
  <div class="p-2 bg-base-300 rounded-lg mb-4 md:mr-2 w-full">
    <h2 class="font-bold text-2xl mb-2">Næste modul info</h2>
    {#if $forside?.skema.length > 0}
    <p class="font-bold text-xl mb-2">{$forside.skema[0].hold}</p>
    <p class="mb-2">{$forside.skema[0].tidspunkt}</p>
    <p class="mb-2">{$forside.skema[0].lokale}</p>

    <!-- måske tilføj mere?? -->

    <a href="/modul/?absid={$forside.skema[0]['absid']}" class="btn btn-sm">Se mere info <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right ml-2" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
      <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
    </svg></a>

    {/if}

  </div>
  <div class="p-2 bg-base-300 rounded-lg mb-4 md:ml-2 w-full">
    <h2 class="font-bold text-2xl mb-2">Kommende moduler</h2>
    {#if $forside?.skema.length > 0}
        {#each $forside.skema as modul}
          <a class={colorModul(modul)} href="/modul/?absid={modul['absid']}">
            {#if modul["navn"]}
              {#if modul["andet"]}
                <div class="tooltip flex justify-center" data-tip="Har indhold">
                  <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-bookmark-fill ml-4 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
                    />
                  </svg>
                </div>
              {:else}
                <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
              {/if}
            {:else}
              <h1 class="text-xl font-bold">{modul["hold"]}</h1>
            {/if}
            <h1 class="text-sm font-bold">{modul["tidspunkt"]}</h1>
            {#if modul["lokale"]}
              <h1 class="text-sm font-bold">{modul["lokale"]}</h1>
            {/if}
          </a>
        {/each}
      {:else}
        <p class="mb-4">Ingen kommende moduler</p>
      {/if}
  </div>
</div>

<UgensSkema />
