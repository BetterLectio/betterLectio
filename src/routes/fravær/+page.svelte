<script>
  import { Doughnut } from "svelte-chartjs";
  import { fravaer, hold } from "$lib/js/store";
  import { get } from "$lib/js/http";
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
  import moment from "moment";

  import { cookieInfo } from "$lib/js/CookieInfo";
  import { HoldOversætter } from "$lib/js/HoldOversætter";
  let cookie;
  let cookieReady = false;
  cookieInfo().then((data) => {
    cookie = data;
    cookieReady = true;
  });

  let BACKGROUND_COLORS = [];

  moment.defineLocale("en-dk", {
    parentLocale: "en",
    months: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
  });
  moment.locale("en-dk");

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

  const timeRegex =
    /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/m;

  let fravaerReady = false;
  let opgjortFravaer = 0;
  let foråretFravaer = 0;
  get("/fravaer").then((data) => {
    try {
      $fravaer = { sort: { col: "procent", ascending: true }, ...data };
      BACKGROUND_COLORS = makeBackgroundColorArray($fravaer.generalt.length);
      $fravaer.generalt.forEach((element) => {
        if (element.hold == "Samlet") {
          opgjortFravaer = element.opgjort_fravær_procent;
          foråretFravaer = element.heleåret_fravær_procent;
        }
      });
      $fravaer?.moduler?.oversigt.reverse();
      fravaerReady = true;
    } catch (error) {
      //sig til bruger at der er sket en fejl
    }
  });

  let monthToFravær = 0;
  $: if ($fravaer) {
    const concFravær = [...$fravaer.moduler.manglende_fraværsårsager, ...$fravaer.moduler.oversigt];
    let monthToFravær = Object.assign({}, ...moment.months().map((monthName) => ({ [monthName]: 0 })));

    for (let index = 0; index < concFravær.length; index++) {
      const modul = concFravær[index].aktivitet;
      const tidspunkt = modul.tidspunkt.match(timeRegex);
      const date = moment(`${tidspunkt[1]} ${tidspunkt[2]}`, "DD/MM-YYYY HH:mm");
      monthToFravær[date.format("MMMM")] = monthToFravær[date.format("MMMM")] + 1;
    }
  }

  //const BACKGROUND_COLORS = [
  //  "rgb(54, 162, 235)", // blue
  //  "rgb(255, 99, 132)", // red
  //  "rgb(255, 159, 64)", // orange
  //  "rgb(255, 205, 86)", // yellow
  //  "rgb(75, 192, 192)", // green
  //  "rgb(153, 102, 255)", // purple
  //];

  function makeBackgroundColorArray(length) {
    if (length == 0) return [];
    let colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(`hsl(${Math.round((i / length) * 1000)}, 100%, 65%)`);
      console.log(Math.round((i / length) * 1000));
    }
    return colors;
  }

  let overblikType = "Opgjort";

  $: sort = (column) => {
    if (column != undefined) {
      if ($fravaer.sort.col == column) {
        $fravaer.sort.ascending = !$fravaer.sort.ascending;
      } else {
        $fravaer.sort.col = column;
        $fravaer.sort.ascending = true;
      }
    } else {
      column = $fravaer.sort.col;
    }
    let sortModifier = $fravaer.sort.ascending ? 1 : -1;
    const parseProcent = (procent) => parseFloat(procent.replace(",", "."));
    let sortFunc = (a, b) => {
      switch (column) {
        case "procent":
          return parseProcent(overblikType == "Opgjort" ? a.opgjort_fravær_procent : a.heleåret_fravær_procent) <
            parseProcent(overblikType == "Opgjort" ? b.opgjort_fravær_procent : b.heleåret_fravær_procent)
            ? -1 * sortModifier
            : parseProcent(overblikType == "Opgjort" ? a.opgjort_fravær_procent : a.heleåret_fravær_procent) >
              parseProcent(overblikType == "Opgjort" ? b.opgjort_fravær_procent : b.heleåret_fravær_procent)
            ? 1 * sortModifier
            : 0;
        case "moduler":
          const aValue = /(([0-9]+,)?[0-9]+)\//g.exec(overblikType == "Opgjort" ? a.opgjort_fravær_moduler : a.heleåret_fravær_moduler)[1];
          const bValue = /(([0-9]+,)?[0-9]+)\//g.exec(overblikType == "Opgjort" ? b.opgjort_fravær_moduler : b.heleåret_fravær_moduler)[1];
          return aValue < bValue ? -1 * sortModifier : aValue > bValue ? 1 * sortModifier : 0;
        case "hold":
          return a.hold < b.hold ? -1 * sortModifier : a.hold > b.hold ? 1 * sortModifier : 0;
      }
    };
    $fravaer.generalt = $fravaer.generalt.sort(sortFunc);
  };
  $: sortArrow = (column, sort) => {
    if (column == sort.col) {
      return sort.ascending ? "▲" : "▼";
    } else {
      return "";
    }
  };
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær</h1>
{#if cookieReady && fravaerReady}
  <div class="stats mb-4 bg-base-200 shadow">
    <div class="stat">
      <div class="stat-title">Opgjort</div>
      <div class="stat-value">{opgjortFravaer}</div>
    </div>
    <div class="stat">
      <div class="stat-title">For året</div>
      <div class="stat-value">{foråretFravaer}</div>
    </div>
  </div>

  <div class="flex w-full flex-col rounded-lg bg-base-200 p-4 lg:flex-row">
    <div class="w-full rounded-lg bg-base-300 p-4 lg:w-1/2">
      <h2 class="text-2xl font-bold">Grafisk oversigt</h2>
      {#if $fravaer?.generalt}
        {#if $fravaer.generalt.at(-1).heleåret_fravær_procent == "0,00%"}
          <p class="mt-4">Du har ikke noget fravær</p>
        {:else}
          <Doughnut
            data={{
              labels: $fravaer.generalt
                .filter((element) => element.hold != "Samlet" && element.opgjort_fravær_procent != "0,00%")
                .map((element) => element.hold),
              datasets: [
                {
                  borderWidth: 0,
                  hoverOffset: 20,
                  label: "Fraværende moduler",
                  data: $fravaer.generalt
                    .filter((element) => element.hold != "Samlet" && element.opgjort_fravær_procent != "0,00%")
                    .map((element) => /(\d+\,?\d*|\,\d+)\//g.exec(element.opgjort_fravær_moduler)[1].replace(",", ".")),
                  backgroundColor: $fravaer.generalt.map((element, index) => BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]),
                },
              ],
            }}
          />
        {/if}
      {/if}

      {#if monthToFravær}
        <Doughnut
          data={{
            labels: [...moment.months().slice(7), ...moment.months().slice(0, 7)], // start ved august, for der starter skoleåret
            datasets: [
              {
                label: "Registreret fravær",
                data: [...Object.values(monthToFravær).slice(7), ...Object.values(monthToFravær).slice(0, 7)], // start ved august, for der starter skoleåret
                fill: "origin",
              },
            ],
          }}
        />
      {/if}
    </div>
    <div class="mt-4 w-full overflow-y-scroll rounded-lg bg-base-300 p-4 lg:ml-4 lg:mt-0">
      <h2 class="mb-4 text-2xl font-bold">Manglende fraværsårsager</h2>
      {#if $fravaer?.moduler?.manglende_fraværsårsager.length}
        <div class="overflow-x-auto">
          <table class="table-zebra table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>modul</th>
                <th>dato</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {#each $fravaer?.moduler?.manglende_fraværsårsager as modul}
                <tr>
                  <td>{modul.aktivitet.navn == null ? HoldOversætter(modul.aktivitet.hold, $hold) : modul.aktivitet.navn}</td>
                  <td>{modul.aktivitet.tidspunkt}</td>
                  <td>
                    <a
                      href={"https://www.lectio.dk/lectio/" +
                        cookie.school +
                        "/fravaer_aarsag.aspx?elevid=" +
                        cookie.userid +
                        "&id=" +
                        modul.aktivitet.absid +
                        "&atype=aa"}
                      class="btn-xs btn">Skriv fraværsårsag</a
                    ></td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p>Du har ingen manglende fraværsårsager</p>
      {/if}
    </div>
  </div>
  <div class="mt-4 rounded-lg bg-none p-0 lg:bg-base-200 lg:p-4">
    <h2 class="mb-2 text-2xl font-bold">Fraværsårsager</h2>
    <table class="table-zebra table-compact table hidden w-full lg:inline-table">
      <!-- head -->
      <thead>
        <tr>
          <th>fag</th>
          <th>navn</th>
          <th>fravær</th>
          <th>dato</th>
          <th>årsag</th>
          <th>årsagsnote</th>
        </tr>
      </thead>
      <tbody>
        {#each $fravaer?.moduler?.oversigt as modul}
          <tr>
            <td>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</td>
            <td>{modul.aktivitet.navn == null ? "" : modul.aktivitet.navn}</td>
            <td>{modul.fravær}</td>

            <td>{modul.aktivitet.tidspunkt}</td>
            <td>
              {#if modul.årsag == "Sygdom"}
                <p class="btn-warning btn-xs btn w-full">{modul.årsag}</p>
              {:else if modul.årsag == "Private forhold"}
                <p class="btn-info btn-xs btn w-full">{modul.årsag}</p>
              {:else if modul.årsag == "Skolerelaterede aktiviteter"}
                <p class="btn-success btn-xs btn w-full">{modul.årsag}</p>
              {:else if modul.årsag == "Kom for sent"}
                <p class="btn-error btn-xs btn w-full">{modul.årsag}</p>
              {:else if modul.årsag == "Andet"}
                <p class="btn-xs btn w-full">{modul.årsag}</p>
              {/if}
            </td>
            <td class="whitespace-pre-wrap">{modul.årsagsnote}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="list lg:hidden">
      {#each $fravaer?.moduler?.oversigt as modul}
        {#if modul.årsag == "Sygdom"}
          <div class="element border-l-4 border-l-warning">
            <p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
            <p>
              <strong>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</strong>
              {modul.årsag}
            </p>
            <p>{modul.årsagsnote}</p>
          </div>
        {:else if modul.årsag == "Private forhold"}
          <div class="element border-l-4 border-l-info">
            <p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
            <p>
              <strong>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</strong>
              {modul.årsag}
            </p>
            <p>{modul.årsagsnote}</p>
          </div>
        {:else if modul.årsag == "Skolerelaterede aktiviteter"}
          <div class="element border-l-4 border-l-success">
            <p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
            <p>
              <strong>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</strong>
              {modul.årsag}
            </p>
            <p>{modul.årsagsnote}</p>
          </div>
        {:else if modul.årsag == "Kom for sent"}
          <div class="element border-l-4 border-l-error">
            <p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
            <p>
              <strong>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</strong>
              {modul.årsag}
            </p>
            <p>{modul.årsagsnote}</p>
          </div>
        {:else if modul.årsag == "Andet"}
          <div class="element">
            <p class="text-sm font-light">{modul.aktivitet.tidspunkt}</p>
            <p>
              <strong>{modul.aktivitet.hold == null ? "" : HoldOversætter(modul.aktivitet.hold, $hold)}</strong>
              {modul.årsag}
            </p>
            <p>{modul.årsagsnote}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <div class="mt-4 rounded-lg bg-none p-0 lg:bg-base-200 lg:p-4">
    <h2 class="mb-2 text-2xl font-bold">Overblik</h2>
    <p class="mb-2">Hold uden fravær er ikke vist.</p>
    <div class="tabs justify-center">
      <button
        on:click={() => {
          overblikType = "Opgjort";
          sort();
        }}
        class="tab tab-lifted {overblikType == 'Opgjort' ? 'tab-active' : ''}">Opgjort</button
      >
      <button
        on:click={() => {
          overblikType = "Hele året";
          sort();
        }}
        class="tab tab-lifted {overblikType == 'Hele året' ? 'tab-active' : ''}">Hele året</button
      >
    </div>
    <table class="table-zebra table-compact table w-full lg:inline-table">
      <!-- head -->
      <thead>
        <tr>
          <th on:click={sort("hold")}>Fag {sortArrow("hold", $fravaer.sort)}</th>
          <th on:click={sort("procent")}>Fravær {sortArrow("procent", $fravaer.sort)}</th>
          <th on:click={sort("moduler")}>Moduler {sortArrow("moduler", $fravaer.sort)}</th>
        </tr>
      </thead>
      <tbody>
        {#each $fravaer?.generalt as fravaerhold}
          {#if fravaerhold.hold != "Samlet" && (overblikType == "Opgjort" ? fravaerhold.opgjort_fravær_procent : fravaerhold.heleåret_fravær_procent) != "0,00%"}
            <tr>
              <td>{HoldOversætter(fravaerhold.hold, $hold)}</td>
              <td>{overblikType == "Opgjort" ? fravaerhold.opgjort_fravær_procent : fravaerhold.heleåret_fravær_procent}</td>
              <td>{overblikType == "Opgjort" ? fravaerhold.opgjort_fravær_moduler : fravaerhold.heleåret_fravær_moduler}</td>
            </tr>
          {/if}
        {/each}
        <!-- Mess but easiest way to get "Samlet" always at bottom (after sorting) -->
        {#each $fravaer?.generalt as fravaerhold}
          {#if fravaerhold.hold == "Samlet"}
            <tr>
              <td>{HoldOversætter(fravaerhold.hold, $hold)}</td>
              <td>{overblikType == "Opgjort" ? fravaerhold.opgjort_fravær_procent : fravaerhold.heleåret_fravær_procent}</td>
              <td>{overblikType == "Opgjort" ? fravaerhold.opgjort_fravær_moduler : fravaerhold.heleåret_fravær_moduler}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div class="loading btn-ghost btn">Indlæser</div>
{/if}
