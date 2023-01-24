<script>
    import { addNotification } from "../../../components/notifyStore";
    import { kantineId } from "../../../components/store.js";

    let kantiner;
    async function loadKantiner() {
        let _kantiner = await fetch("https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_company_group&group_slug=grabngo", {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        kantiner = await _kantiner.json()
    }
    loadKantiner()

    let kantine = loadKantine($kantineId);
    async function loadKantine(kantineDomain) {
        if (kantineDomain.target != undefined) {
            kantineDomain = kantineDomain.target.value
        }
        let _kantine = await fetch(`https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_data&domain=${kantineDomain}`, {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        let __kantine = await _kantine.json()
        __kantine = __kantine.company[0]

        let _varer = await fetch(`https://api.nemtakeaway.dk/api/v1/products.php?selfservice_token=${kantineDomain}&cmd=get_categories_list&get_products=true`, {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        let varer = await _varer.json()
        __kantine.varer = varer.categories
        kantine = __kantine
    }

    addNotification("Denne side virker kun hvis din skole benytter sig af Grab 'N Go.", "alert-warning")
    addNotification("Kunne du tænke dig at det system din skole bruger også er understøttet så kontakt os på vores Discord.")
</script>

{#if kantiner}
    <select
        type="text"
        name="skole"
        id="skole"
        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Vælg din skole"
        on:change={loadKantine}
        bind:value={$kantineId}
    >
        <option disabled selected value={undefined}>Vælg din kantine</option>
        {#each kantiner.companies as kantine}
            <option value={kantine.domain}>
                {kantine.name}
            </option>
        {/each}
    </select>
{/if}

{#if JSON.stringify(kantine) != "{}"}
    {#each kantine.varer as kategori}
        {#if kategori.products.length != 0}
            <p class="font-bold text-3xl">{JSON.parse(kategori.name)["da-dk"]}</p>
            <div class="grid grid-cols-4 gap-4">
                {#each kategori.products as vare}
                    <div class="element w-72 h-48 text-black" style='background-image: url("https://cdn.nemtakeaway.dk/site/upload/{Object.values(vare.api_array.images)[0].src}"); background-size: cover;'>
                        <div class="backdrop-blur-sm p-2 rounded-lg">
                            <p class="font-bold text-xl">{JSON.parse(vare.name)["da-dk"]}</p>
                            <p>{vare.price} {kantine.currency_code}</p>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/each}
    {#if kantine.varer == 0}
        <p>Kantinen sælger på nuværende tidspunkt ingen varer</p>
    {/if}
{/if}