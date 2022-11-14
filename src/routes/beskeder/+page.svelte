<script>
    /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
    import { get } from "../../components/http.js"

    let beskeder = [];
    let profilePicturePaths = {};
    let ready = false;
    async function fåBeskeder() {
        await fåLærereElever()
        beskeder = await get(
            `/beskeder`
        );
        console.log(beskeder)
        beskeder.beskeder.forEach(besked => {
            console.log(besked.førsteBesked)
        });
        ready = true
    }

    let lærereOgElever = {}
    async function fåLærereElever() {
        const informationer = await get("/informationer")
        lærereOgElever = informationer["lærere"]
        for (const [key, value] of Object.entries(informationer.elever)) {
            let navn = key.split("(")[1].split(" ")
            navn.pop()
            navn = `${key.split("(")[0]}(${navn.join(" ")})`
            lærereOgElever[navn] = value
        }
    }
</script>

<body use:fåBeskeder>
    <h1 class="text-3xl font-bold mb-4">Beskeder</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if ready}
    <div class="btn-group overflow-x-scroll w-full mb-4">
        {#each beskeder.besked_muligheder as beskedMulighed}
            <!-- Få mapper til at åbne når man klikker på dem-->
            {#if beskedMulighed.selected}

                <btn class="btn btn-active">{beskedMulighed.name}</btn>
            {:else}
                <btn class="btn">{beskedMulighed.name}</btn>
            {/if}
        {/each}
    </div>
        <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl">
            {#each beskeder.beskeder as besked}
            <li>
                <a class="block" href="/besked?id={besked.message_id}">
                    <div class="flex justify-between">
                        <div class="flex items-center">
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img src="https://better-lectio-flask-backend.vercel.app/profil_billed?id={lærereOgElever[besked.førsteBesked]}&cookie={localStorage.getItem("authentication")}" class="object-cover w-14 h-14 rounded-full" on:error={function(error){
                                error.target.outerHTML = `
                                <div class="inline-flex overflow-hidden relative justify-center items-center w-14 h-14 bg-gray-100 rounded-full dark:bg-gray-600">
                                    <span class="font-medium text-gray-600 dark:text-gray-300">${besked.førsteBesked[0]}</span>
                                </div>`}}/>
                            <div class="ml-5">
                                <p part="emne" class="text-lg font-bold">{besked.emne}</p>
                                <p part="afsender">{besked.førsteBesked} · {besked.ændret}</p>
                            </div>
                        </div>
                        <div class="right-1 flex items-center">
                            <div class="flex -space-x-4">
                                <!-- Place holder billeder for modtagere af beskeden-->
                                <img class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png" alt="">
                                <img class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png" alt="">
                                <img class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png" alt="">
                                <a class="flex justify-center items-center w-10 h-10 text-xs font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800" href="#">+99</a>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
            {/each}
        </ul>
    {/if}
</body>