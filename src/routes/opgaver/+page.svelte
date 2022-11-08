<script>
    import { get } from "../../components/http.js"

    let opgaver = [];
    let ikkeAfleveredeOpgaver = [];
    let afleveredeOpgaver = [];

    let afleveredeOpgaverSelected = false;

    let ikkeAfleveredeOpgaverClass = "btn btn-primary";
    let afleveredeOpgaverClass = "btn";

    let ready = false;
    async function fåOpgaver() {
        const _opgaver = await get("/opgaver")
        _opgaver.forEach(opgave => {
            if (opgave.status == "Afleveret") {
                afleveredeOpgaver.push(opgave)
            } else {
                ikkeAfleveredeOpgaver.push(opgave)
            }
            
        });
        
        opgaver = ikkeAfleveredeOpgaver;
        ready = true;
    }

    function changeView() {
        afleveredeOpgaverSelected = !afleveredeOpgaverSelected
        if (afleveredeOpgaverSelected) {
            opgaver = afleveredeOpgaver;
            ikkeAfleveredeOpgaverClass = "btn"
            afleveredeOpgaverClass = "btn btn-primary"
        } else {
            opgaver = ikkeAfleveredeOpgaver;
            ikkeAfleveredeOpgaverClass = "btn btn-primary"
            afleveredeOpgaverClass = "btn"
        }
    }
</script>

<body use:fåOpgaver>
    <h1 class="text-3xl font-bold my-4">Opgaver</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={ikkeAfleveredeOpgaverClass} on:click={changeView}>Ikke afleveret opgaver</btn>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={afleveredeOpgaverClass} on:click={changeView}>Afleverede opgaver</btn>
    {#if ready}
        <ul class="menu bg-base-100 w-full p-2 my-4 rounded-box drop-shadow-xl md:w-fit">
            {#each opgaver as opgave}
                <li class="">
                    <a href="/opgave?exerciseid={opgave.exerciseid}">
                        <div>
                            <p><span class="font-bold">{opgave.opgavetitel} · {opgave.hold}</span> ({opgave.frist})</p>
                            <p>{opgave.opgavenote}</p>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    {/if}
</body>
