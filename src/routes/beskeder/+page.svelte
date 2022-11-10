<script>
    /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
    import { get } from "../../components/http.js"

    let beskeder = [];
    let ready = false;
    async function fåBeskeder() {
        beskeder = await get(
            `/beskeder`
        );
        console.log(beskeder);
        ready = true
    }
</script>

<body use:fåBeskeder>
    <h1 class="text-3xl font-bold mb-4">Beskeder</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if ready}
    <div class="btn-group overflow-x-scroll w-full mb-4">
        <btn class="btn btn-active">Place holder for aktiv</btn>
        {#each beskeder.beskedMuligheder as beskedMulighed}
            <!-- Få mapper til at åbne når man klikker på dem-->
            <btn class="btn">{beskedMulighed.name}</btn>
        {/each}
    </div>
        <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl">
            {#each beskeder.beskeder as besked}
            <li>
                <a class="block" href="/besked?id={besked.message_id}">
                    <div>
                        <p part="afsender" class="btn btn-xs w-full">{besked.førsteBesked} ({besked.ændret})</p>
                        <p part="emne" class="text-lg font-bold">{besked.emne}</p>

                    </div>
                </a>
            </li>
            {/each}
        </ul>
    {/if}
</body>