<script>
    import { addNotification } from "../../../components/notifyStore";
    import { kantine } from "../../../components/store.js";

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

    async function loadKantine(kantineDomain) {
        let _kantine = await fetch(`https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_data&domain=${kantineDomain.target.value}`, {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        let __kantine = await _kantine.json()
        $kantine = __kantine.company[0]

        let _varer = await fetch(`https://api.nemtakeaway.dk/api/v1/products.php?selfservice_token=${kantineDomain.target.value}&cmd=get_categories_list&get_products=true`, {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        let varer = await _varer.json()
        $kantine.varer = varer.categories
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
    >
        <option disabled selected value={undefined}>Vælg din kantine</option>
        {#each kantiner.companies as kantine}
            <option value={kantine.domain}>
                {kantine.name}
            </option>
        {/each}
    </select>
{/if}

{#if $kantine}
    <p>Kantine: {$kantine.name}</p>
    {#each $kantine.varer as kategori}
        {#if kategori.products.length != 0}
            <p class="font-bold text-3xl">{JSON.parse(kategori.name)["da-dk"]}</p>
            <div class="grid grid-cols-4 gap-4">
                {#each kategori.products as vare}
                    <div class="element w-72 h-48">
                        <p class="font-bold text-xl">{JSON.parse(vare.name)["da-dk"]}</p>
                        <p>{vare.price} {$kantine.currency_code}</p>
                        <img class="h-20" src="https://cdn.nemtakeaway.dk/site/upload/{Object.values(vare.api_array.images)[0].src}" alt="Billed af maden"/>
                    </div>
                {/each}
            </div>
        {/if}
    {/each}
{/if}