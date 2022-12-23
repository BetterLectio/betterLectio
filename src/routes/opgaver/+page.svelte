<script>
  import { get } from "../../components/http.js";
  import { opgaver } from "../../components/store.js";
  import { fade } from "svelte/transition";

  let _opgaver = [];

  let opgaverIndstillinger = {};
  if (localStorage.getItem("opgaver_indstillinger")) {
    opgaverIndstillinger = JSON.parse(localStorage.getItem("opgaver_indstillinger"));
  } else {
    // JSON.parse threw an error, so the opgaver_instillinger item is not a valid JSON string
    opgaverIndstillinger = {
      // dette er kun for table
      erFristAbsolutITabel: true,
      visHeleBeskrivelsenITabel: false,
    };
    localStorage.setItem("opgaver_indstillinger", JSON.stringify(opgaverIndstillinger));
  }

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

  function sortOpgaver(__opgaver) {
    let ikkeAfleveredeOpgaver = [];
    let afleveredeOpgaver = [];
    let afsluttedeOpgaver = [];

    //loop trouh __opgaver
    for (const opgave of __opgaver) {
      let _date = opgave.frist.replace("-", "/").split(" ");
      let __date = _date[0].split("/");
      opgave.date = new Date(`${__date[1]}/${__date[0]}-${__date[2]} ${_date[1]}`);
      if (opgave.status == "Afleveret") {
        opgave.class = "btn btn-success";
        afleveredeOpgaver.push(opgave);
        continue;
      } else if (opgave.status == "Afsluttet") {
        opgave.class = "btn";
        afsluttedeOpgaver.push(opgave);
        continue;
      } else if (opgave.status == "Venter") {
        opgave.class = "btn btn-warning";
      } else {
        opgave.class = "btn btn-error";
      }
      ikkeAfleveredeOpgaver.push(opgave);
      afleveredeOpgaver.reverse();
    }

    if (selected == "ikkeAfleveredeOpgaver") {
      return ikkeAfleveredeOpgaver;
    } else if (selected == "afleveredeOpgaver") {
      return afleveredeOpgaver;
    } else {
      return afsluttedeOpgaver;
    }
  }

  let selected = "ikkeAfleveredeOpgaver";

  let searchString = "";
  function search() {
    selected = "search";

    let searchResults = [];
    $opgaver.forEach((opgave) => {
      if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) {
        searchResults.push(opgave);
      }
    });
    _opgaver = searchResults;
  }

  function dageIndtil(date) {
    return Math.floor((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  }
</script>

<div>
  <h1 class="my-4 text-3xl font-bold">Opgaver</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="flex flex-col sm:flex-row ">
    <div class="tabs tabs-boxed w-full justify-between sm:w-fit">
      <button
        class={selected == "ikkeAfleveredeOpgaver"
          ? "tab- tab tab-active tab-lg sm:tab-md"
          : "tab tab-lg sm:tab-md"}
        on:click={() => {
          selected = "ikkeAfleveredeOpgaver";
        }}>Ikke-afleverede</button
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button
        class={selected == "afleveredeOpgaver" ? "tab tab-active tab-lg sm:tab-md" : "tab tab-lg sm:tab-md"}
        on:click={() => {
          selected = "afleveredeOpgaver";
        }}>Afleverede</button
      >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <button
        class={selected == "afsluttedeOpgaver" ? "tab tab-active tab-lg sm:tab-md" : "tab tab-lg sm:tab-md"}
        on:click={() => {
          selected = "afsluttedeOpgaver";
        }}>Afsluttet</button
      >
    </div>
    <input
      type="text"
      placeholder="Søg"
      class="input input-lg mt-4 w-full bg-base-200 sm:mt-0 sm:ml-4 sm:h-10 sm:w-fit"
      bind:value={searchString}
      on:input={search}
    />
    <div class="dropdown dropdown-end hidden ml-4 lg:inline-flex">
      <label tabindex="0" class="btn btn-sm m-0 h-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
      </svg></label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        <li>{JSON.stringify(opgaverIndstillinger)}</li>
      </ul>
    </div>
  </div>

  {#if _opgaver}
    <ul class="list my-4 lg:hidden">
      {#each _opgaver as opgave}
        <li
          class="relative flex {opgave.class} mt-2 h-full w-full justify-start text-left font-normal normal-case"
        >
          <a class="mt-2 mb-2" href="/opgave?exerciseid={opgave.exerciseid}">
            <div class="flex items-center">
              <div class="mr-4 flex-none">
                <div>
                  <p><strong>{opgave.frist.split("-")[0]}</strong></p>
                  <p><strong>{opgave.frist.split(" ")[1]}</strong></p>
                </div>
              </div>

              <div class="flex-1">
                <p class="font-bold line-clamp-1 {opgave.status == 'Venter' ? 'mr-16' : ''}">
                  {opgave.opgavetitel}
                </p>
                <p>{opgave.hold}</p>
                <p class="line-clamp-2 {opgave.status == 'Venter' ? 'mr-12' : ''}">{opgave.opgavenote}</p>
              </div>

              {#if opgave.status == "Venter"}
                <div class="flex items-center">
                  <div class="absolute right-0 mr-4">
                    <p><strong>Om</strong></p>
                    <p><strong>{dageIndtil(opgave.date)} dage</strong></p>
                  </div>
                </div>
              {/if}
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
              <td class="text-left" id={opgave.exerciseid}>
                <div>
                  {opgave.opgavenote}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
