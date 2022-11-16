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

<div use:fåOpgaver>
    <h1 class="text-3xl font-bold my-4">Opgaver</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={ikkeAfleveredeOpgaverClass} on:click={changeView}>Ikke afleveret opgaver</btn>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <btn class={afleveredeOpgaverClass} on:click={changeView}>Afleverede opgaver</btn>
    {#if ready}
        <ul class="menu bg-base-100 w-full p-2 my-4 rounded-box drop-shadow-xl md:w-full lg:hidden">
            {#each opgaver as opgave}
                <li class="block">
                    <a class="block" href="/opgave?exerciseid={opgave.exerciseid}">
                        <div>
                            {#if afleveredeOpgaverSelected == true}
                            <p class="btn btn-success btn-xs w-full">{opgave.opgavetitel} · {opgave.hold}</p>
                            {/if}
                            {#if afleveredeOpgaverSelected == false}
                            <p class="btn btn-warning btn-xs w-full">{opgave.opgavetitel} · {opgave.hold}</p> 
                            {/if}
                            <p>({opgave.frist})</p>
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
                <tbody class="w-full">
                    {#each opgaver as opgave}
                        <tr class="">
                            {#if afleveredeOpgaverSelected == true}    
                            <td><a href="/opgave?exerciseid={opgave.exerciseid}" class="btn btn-success btn-xs w-full">{opgave.opgavetitel}</a></td>
                            {/if}
                            {#if afleveredeOpgaverSelected == false}
                            <td><a href="/opgave?exerciseid={opgave.exerciseid}" class="btn btn-warning btn-xs w-full">{opgave.opgavetitel}</a></td>
                            {/if}
                            <td class="">{opgave.hold}</td>
                            <td class=""><p class="btn btn-xs">{opgave.frist}</p></td>
                            <td class="text-left whitespace-normal" id={opgave.exerciseid}>
                                    <div class="hidden sm:hidden md:hidden lg:block xl:hidden whitespace-normal">{cutOpgaveNote(opgave, 30)}</div>
                                    <div class="hidden sm:hidden md:hidden lg:hidden xl:block whitespace-normal">{cutOpgaveNote(opgave, 50)}</div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        
    {/if}
</div>
