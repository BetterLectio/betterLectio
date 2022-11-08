<script>
    //import table from "markdown-it/lib/rules_block/table.js";
    //import table from "markdown-it/lib/rules_block/table.js";
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

    // cut the opgave.opgavenote to 1 line
    function cutOpgaveNote(opgave, length) {
        let opgavenote = opgave.opgavenote;
        if (opgavenote.length > length) {
            opgavenote = opgavenote.substring(0, length) + "...";
        }
        return opgavenote;
    }
</script>

<body use:fåOpgaver>
    <h1 class="text-3xl font-bold my-4">Opgaver</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={ikkeAfleveredeOpgaverClass} on:click={changeView}>Ikke afleveret opgaver</btn>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={afleveredeOpgaverClass} on:click={changeView}>Afleverede opgaver</btn>
    {#if ready}
        <ul class="menu bg-base-100 w-full p-2 my-4 rounded-box drop-shadow-xl md:w-fit lg:hidden">
            {#each opgaver as opgave}
                <li class="">
                    <a href="/opgave?exerciseid={opgave.exerciseid}">
                        <div>
                            <p><span class="font-bold">{opgave.opgavetitel} · {opgave.hold}</span> ({opgave.frist})</p>
                            <p>{cutOpgaveNote(opgave, 100)}</p>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
        <div class="overflow-x-hidden hidden lg:flex">
            <table class="table w-full table-zebra my-4">
                <thead>
                    <tr>
                        <th>Opgavetitel</th>
                        <th>Hold</th>
                        <th>Frist</th>
                        <th>Opgavenote</th>
                    </tr>
                </thead>
                <tbody>
                    {#each opgaver as opgave}
                        <tr>
                            <td><a href="/opgave?exerciseid={opgave.exerciseid}">{opgave.opgavetitel}</a></td>
                            <td>{opgave.hold}</td>
                            <td>{opgave.frist}</td>
                            <td class="text-left flex flex-row whitespace-normal" id={opgave.exerciseid}>
                                    <div class="hidden sm:hidden md:hidden lg:flex xl:hidden whitespace-normal">{cutOpgaveNote(opgave, 30)}</div>
                                    <div class="hidden sm:hidden md:hidden lg:hidden xl:flex whitespace-normal">{cutOpgaveNote(opgave, 100)}</div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
    {/if}
</body>
