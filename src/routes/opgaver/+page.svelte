<script>
  import { get } from "../../components/http.js";
  import { opgaver } from "../../components/store.js";
  import { fade } from "svelte/transition";

  let _opgaver = [];

  get("/opgaver").then((data) => {
    $opgaver = data;
  });

  $: if (
    $opgaver &&
    (selected == "ikkeAfleveredeOpgaver" ||
      selected == "afleveredeOpgaver" ||
      selected == "afsluttedeOpgaver")
  ) {
    _opgaver = sortOpgaver($opgaver);
  }
  
  var alleOpgaver = [];
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
  
  let searchString = "";
  function search() {
    selected = "search";
    
    let searchResults = [];
    $opgaver.forEach(opgave => {
      if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.push(opgave);
      }
    })
    _opgaver = searchResults;
  }
</script>

<div>
  <h1 class="my-4 text-3xl font-bold">Opgaver</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="flex flex-col sm:flex-row ">
    <div class="tabs tabs-boxed w-fit">
      <button
        class={selected == "ikkeAfleveredeOpgaver"
          ? "tab tab-active tab-sm sm:tab-md"
          : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "ikkeAfleveredeOpgaver";
        }}>Ikke-afleverede</button
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button
        class={selected == "afleveredeOpgaver" ? "tab tab-active tab-sm sm:tab-md" : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "afleveredeOpgaver";
        }}>Afleverede</button
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button
        class={selected == "afsluttedeOpgaver" ? "tab tab-active tab-sm sm:tab-md" : "tab tab-sm sm:tab-md"}
        on:click={() => {
          selected = "afsluttedeOpgaver";
        }}>Afsluttet</button
      >
    </div>
    <input
      type="text"
      placeholder="Søg"
      class="input m-0 mt-4 h-10 w-fit bg-base-200 sm:mt-0 sm:ml-4 sm:w-fit"
      bind:value={searchString}
      on:input={search}
    />
  </div>

  {#if _opgaver}
    <ul class="list my-4 lg:hidden">
      {#each _opgaver as opgave}
        <li class="element">
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
          {#each _opgaver as opgave (opgave.exerciseid)}
            <tr class="" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
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
