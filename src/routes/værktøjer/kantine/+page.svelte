<script>
  import { addNotification } from "$lib/js/notifyStore";
  import { indstillinger } from "$lib/js/store.js";
  $indstillinger ||= {};
  $indstillinger.kantineId ||= null;

  let kantiner;
  async function loadKantiner() {
    let _kantiner = await fetch("https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_company_group&group_slug=grabngo", {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
      },
    });
    kantiner = await _kantiner.json();
  }
  loadKantiner();

  let kantine = loadKantine($indstillinger.kantineId);
  async function loadKantine(kantineDomain) {
    if (kantineDomain?.target) {
      kantineDomain = kantineDomain.target.value;
    }
    let _kantine = await fetch(`https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_data&domain=${kantineDomain}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
      },
    });
    let __kantine = await _kantine.json();
    __kantine = __kantine.company[0];

    let _varer = await fetch(
      `https://api.nemtakeaway.dk/api/v1/products.php?selfservice_token=${kantineDomain}&cmd=get_categories_list&get_products=true`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
        },
      }
    );
    let varer = await _varer.json();
    __kantine.varer = varer.categories;
    kantine = __kantine;
  }

  addNotification("Denne side virker kun hvis din skole benytter sig af Grab 'N Go.", "alert-warning");
  addNotification("Kunne du tænke dig at det system din skole bruger også er understøttet så kontakt os på vores Discord.");

  let closed = [];
</script>

{#if kantiner}
  <select
    type="text"
    name="skole"
    id="skole"
    class="input block w-full flex-1 bg-base-300"
    placeholder="Vælg din skole"
    on:change={loadKantine}
    bind:value={$indstillinger.kantineId}
  >
    <option disabled selected value={undefined}>Vælg din kantine</option>
    {#each kantiner.companies as kantine}
      <option value={kantine.domain}>
        {kantine.name}
      </option>
    {/each}
  </select>
  {#if !$indstillinger.kantineId}
    <div class="mt-20 flex justify-center">
      <h1 class="heading">Vælg en skole</h1>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
        <path
          fill-rule="evenodd"
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
        />
      </svg>
    </div>
  {/if}
{/if}

{#if JSON.stringify(kantine) != "{}"}
  {#each kantine.varer as kategori}
    {#if kategori.products.length != 0}
      <div
        tabindex="0"
        class="collapse-plus rounded-box collapse {closed[kategori.name]
          ? 'collapse-close'
          : 'collapse-open'} my-5 border border-base-300 bg-base-300"
      >
        <div
          class="collapse-title cursor-pointer"
          on:click={() => (closed[kategori.name] ? (closed[kategori.name] = false) : (closed[kategori.name] = true))}
        >
          <h2 class="text-2xl font-bold">{JSON.parse(kategori.name)["da-dk"]}</h2>
        </div>
        <div class="collapse-content pb-0.5">
          <div class="grid grid-cols-1 pt-2 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3 2xl:grid-cols-4 2xl:gap-4">
            {#each kategori.products as vare}
              <!-- prettier-ignore -->
              <div class="element md:w-full lg:w-72 h-48 text-black" style='background-image: url("https://cdn.nemtakeaway.dk/site/upload/{Object.values(vare.api_array.images)[0].src}"); background-size: cover;'>
                                <div class="backdrop-blur-sm p-2 rounded-lg">
                                    <p class="font-bold text-xl">{JSON.parse(vare.name)["da-dk"]}</p>
                                    <p>{vare.price} {kantine.currency_code}</p>
                                </div>
                            </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  {/each}
  {#if kantine.varer == 0}
    <p>Kantinen sælger på nuværende tidspunkt ingen varer</p>
  {/if}
{/if}
