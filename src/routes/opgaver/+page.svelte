<script>
    import { get } from "../../components/http.js"

    let opgaver = [];
    let ikkeAfleveretOpgaver = [];
    let afleveretOpgaver = [];
    let selected = 0;
    let ready = false;
    async function fåOpgaver() {
        opgaver = await get("/opgaver")
        opgaver.forEach(opgave => {
            if (opgave.status == "Afleveret") {
                afleveretOpgaver.push(opgave)
            } else {
                ikkeAfleveretOpgaver.push(opgave)
            }
            
        });
        
        ready = true;
    }
</script>

<body use:fåOpgaver>
    <h1 class="text-3xl font-bold">Opgaver</h1>
    <br />
    <a class="btn btn-primary">Ikke afleveret opgaver</a>
    <a class="btn">Afleveret opgaver</a>
    {#if ready}
        <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl md:w-fit">
            {#each ikkeAfleveretOpgaver as opgave}
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
