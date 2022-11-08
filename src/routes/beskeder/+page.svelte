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
    <h1 class="text-3xl font-bold">Beskeder</h1>
    <br/>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if ready}
        <btn class="btn btn-primary">Place holder for aktiv</btn>
        {#each beskeder.beskedMuligheder as beskedMulighed}
            <!-- Få mapper til at åbne når man klikker på dem-->
            <btn class="btn">{beskedMulighed.name}</btn>
        {/each}
        <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl md:w-fit">
            {#each beskeder.beskeder as besked}
            <li>
                <a href="/besked?id={besked.message_id}">
                    <div>
                        <!-- INDSÆT PROFIL BILLEDE AF DEN SOM SENDTE BESKEDEN -->
                        <p>{JSON.stringify(besked)}</p>
                    </div>
                </a>
            </li>
            {/each}
        </ul>
    {/if}
</body>