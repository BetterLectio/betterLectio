<script>
  import { get } from "../../components/http.js";
  import { opgaver } from "../../components/store.js";

  let _opgaver = [];

  get("/opgaver").then((data) => {
    console.log("data:", data);
    $opgaver = data;
  });

  $: if (
    $opgaver &&
    (selected == "ikkeAfleveredeOpgaver" ||
      selected == "afleveredeOpgaver" ||
      selected == "afsluttedeOpgaver")
  ) {
    _opgaver = sortOpgaver($opgaver);
    console.log("_opgaver:", _opgaver);
  }

  function sortOpgaver(__opgaver) {
    let ikkeAfleveredeOpgaver = [];
    let afleveredeOpgaver = [];
    let afsluttedeOpgaver = [];

    __opgaver.forEach((opgave) => {
      if (opgave.status == "Afleveret") {
        opgave.class = "btn btn-success";
        afleveredeOpgaver.push(opgave);
      } else if (opgave.status == "Afsluttet") {
        opgave.class = "btn";
        afsluttedeOpgaver.push(opgave);
      } else {
        if (opgave.status == "Venter") {
          opgave.class = "btn btn-warning";
        } else {
          opgave.class = "btn btn-error";
        }
        ikkeAfleveredeOpgaver.push(opgave);
      }
      afleveredeOpgaver.reverse();
    });
    if (selected == "ikkeAfleveredeOpgaver") {
      return ikkeAfleveredeOpgaver;
    } else if (selected == "afleveredeOpgaver") {
      return afleveredeOpgaver;
    } else {
      return afsluttedeOpgaver;
    }
  }

  let selected = "ikkeAfleveredeOpgaver";

  // cut the opgave.opgavenote to 1 line
  function cutOpgaveNote(opgave, length) {
    let opgavenote = opgave.opgavenote;
    if (opgavenote.length > length) {
      opgavenote = opgavenote.substring(0, length) + "...";
    }
    return opgavenote;
  }
</script>

<div>
  <h1 class="my-4 text-3xl font-bold">Opgaver</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <btn
    class={selected == "ikkeAfleveredeOpgaver" ? " btn-primary btn mb-2" : "btn mb-2"}
    on:click={() => {
      selected = "ikkeAfleveredeOpgaver";
    }}>Ikke-afleverede opgaver</btn
  >
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <btn
    class={selected == "afleveredeOpgaver" ? " btn-primary btn mb-2" : "btn mb-2"}
    on:click={() => {
      selected = "afleveredeOpgaver";
    }}>Afleverede opgaver</btn
  >
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <btn
    class={selected == "afsluttedeOpgaver" ? " btn-primary btn mb-2" : "btn mb-2"}
    on:click={() => {
      selected = "afsluttedeOpgaver";
    }}>Afsluttet opgaver</btn
  >

  {#if _opgaver}
    <ul class="menu rounded-box my-2 w-full bg-base-100 p-2 drop-shadow-xl md:w-full lg:hidden">
      {#each _opgaver as opgave}
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
          {#each _opgaver as opgave}
            <tr class="">
              <td>
                <a href="/opgave?exerciseid={opgave.exerciseid}" class="{opgave.class} btn-xs w-full"
                  >{opgave.opgavetitel}</a
                ></td
              >
              <td class="">{opgave.hold}</td>
              <td class=""><p class="btn-xs btn">{opgave.frist}</p></td>
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
