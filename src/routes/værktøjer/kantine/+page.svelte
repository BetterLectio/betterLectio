<script>
    import { addNotification } from "../../../components/notifyStore";

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

    let kantine;
    async function loadKantine(kantineDomain) {
        let _kantine = await fetch(`https://api.nemtakeaway.dk/api/v1/companies.php?cmd=get_data&domain=${kantineDomain.target.value}`, {
            headers: {
                "accept": 'application/json, text/javascript, */*; q=0.01'
            }
        })
        kantine = await _kantine.json()
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

{#if kantine}
    <p>{JSON.stringify(kantine.company)}</p>
{/if}