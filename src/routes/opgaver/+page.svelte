<script>
  //import table from "markdown-it/lib/rules_block/table.js";
  //import table from "markdown-it/lib/rules_block/table.js";
  import { get } from "../../components/http.js";

  let opgaver = [];
  let ikkeAfleveredeOpgaver = [];
  let afleveredeOpgaver = [];

  let afleveredeOpgaverSelected = false;

  let ikkeAfleveredeOpgaverClass = "btn btn-primary";
  let afleveredeOpgaverClass = "btn";

  let ready = false;
  async function fåOpgaver() {
    const _opgaver = await get("/opgaver");
    _opgaver.forEach((opgave) => {
      if (opgave.status == "Afleveret") {
        opgave.class = "btn btn-success";
        afleveredeOpgaver.push(opgave);
      } else {
        if (opgave.status == "Venter") {
          opgave.class = "btn btn-warning";
        } else {
          opgave.class = "btn btn-error";
        }
        ikkeAfleveredeOpgaver.push(opgave);
      }
    });
    //sort so newest is on top
    afleveredeOpgaver.reverse();

    opgaver = ikkeAfleveredeOpgaver;
    ready = true;
  }

  function changeView() {
    afleveredeOpgaverSelected = !afleveredeOpgaverSelected;
    if (afleveredeOpgaverSelected) {
      opgaver = afleveredeOpgaver;
      ikkeAfleveredeOpgaverClass = "btn";
      afleveredeOpgaverClass = "btn btn-primary";
    } else {
      opgaver = ikkeAfleveredeOpgaver;
      ikkeAfleveredeOpgaverClass = "btn btn-primary";
      afleveredeOpgaverClass = "btn";
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
  <h1 class="my-4 text-3xl font-bold">Opgaver</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <btn class={ikkeAfleveredeOpgaverClass} on:click={changeView}>Ikke afleveret opgaver</btn>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <btn class={afleveredeOpgaverClass} on:click={changeView}>Afleverede opgaver</btn>
  {#if ready}
    <ul class="menu rounded-box my-4 w-full bg-base-100 p-2 drop-shadow-xl md:w-full lg:hidden">
      {#each opgaver as opgave}
        <li class="block">
          <a class="block" href="/opgave?exerciseid={opgave.exerciseid}">
            <div>
              <p class="{opgave.class} btn-xs w-full">{opgave.opgavetitel} · {opgave.hold}</p>
              <p>({opgave.frist})</p>
              <p>{cutOpgaveNote(opgave, 100)}</p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
    <div class="hidden overflow-x-hidden lg:flex">
      <table class="table-zebra my-4 table w-full">
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
              <td>
                <a href="/opgave?exerciseid={opgave.exerciseid}" class="{opgave.class} btn-xs w-full"
                  >{opgave.opgavetitel}</a
                ></td
              >
              <td class="">{opgave.hold}</td>
              <td class=""><p class="btn btn-xs">{opgave.frist}</p></td>
              <td class="whitespace-normal text-left" id={opgave.exerciseid}>
                <div class="hidden whitespace-normal sm:hidden md:hidden lg:block xl:hidden">
                  {cutOpgaveNote(opgave, 30)}
                </div>
                <div class="hidden whitespace-normal sm:hidden md:hidden lg:hidden xl:block">
                  {cutOpgaveNote(opgave, 50)}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
