<script>
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";
  import { Chart, registerables } from "chart.js";
  import moment from "moment";

  moment.defineLocale("en-dk", {
    parentLocale: "en",
    months: [
      "Januar",
      "Februar",
      "Marts",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "December",
    ],
  });
  moment.locale("en-dk");

  // https://github.com/chartjs/Chart.js/blob/master/src/plugins/plugin.colors.ts#L13
  const BACKGROUND_COLORS = [
    "rgb(54, 162, 235)", // blue
    "rgb(255, 99, 132)", // red
    "rgb(255, 159, 64)", // orange
    "rgb(255, 205, 86)", // yellow
    "rgb(75, 192, 192)", // green
    "rgb(153, 102, 255)", // purple
    "rgb(201, 203, 207)", // grey
  ];
  const timeRegex =
    /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/m;

  Chart.register(...registerables);
  let modulerChartElement;
  let yearChartElement;

  let samletFravaer = null;
  get("/fravaer").then((data) => {
    $fravaer = { sort: { col: "procent", ascending: true }, data };
    sort("procent"); // Altid sorter efter fravær procent først
    $fravaer.data.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        samletFravaer = parseFloat(element.fravær_procent);
      }
    });
    new Chart(modulerChartElement, {
      type: "bar",
      data: {
        labels: $fravaer.data.generalt
          .filter((element) => element.hold != "Samlet" && element.fravær_procent != "0,00%")
          .map((element) => element.hold),
        datasets: [
          {
            label: "Fraværende moduler",
            data: $fravaer.data.generalt
              .filter((element) => element.hold != "Samlet" && element.fravær_procent != "0,00%")
              .map((element) => /([0-9]+)\//g.exec(element.fravær_moduler)[1]),
            backgroundColor: $fravaer.data.generalt.map(
              (element, index) => BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]
            ),
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Fag",
            },
          },
          y: {
            title: {
              display: true,
              text: "Antal fraværende moduler",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    const concFravær = [...$fravaer.data.moduler.manglende_fraværsårsager, ...$fravaer.data.moduler.oversigt];
    let monthToFravær = Object.assign({}, ...moment.months().map((monthName) => ({[monthName]: 0})));

    for (let index = 0; index < concFravær.length; index++) {
      const modul = concFravær[index].aktivitet;
      const tidspunkt = modul.tidspunkt.match(timeRegex);
      const date = moment(`${tidspunkt[1]} ${tidspunkt[2]}`, "DD/MM-YYYY HH:mm");
      monthToFravær[date.format("MMMM")] = monthToFravær[date.format("MMMM")] + 1;
    }

    new Chart(yearChartElement, {
      type: "line",
      data: {
        labels: [...moment.months().slice(7), ...moment.months().slice(0, 7)], // start ved august, for der starter skoleåret
        datasets: [
          {
            label: "Registreret fravær",
            data: [...Object.values(monthToFravær).slice(7), ...Object.values(monthToFravær).slice(0, 7)], // start ved august, for der starter skoleåret
            fill: "origin",
          },
        ],
      },
      options: {
        elements: {
          line: {
            tension: 0.4,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Måned",
            },
          },
          y: {
            title: {
              display: true,
              text: "Registreret fravær",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  });

  $: sort = (column) => {
    if ($fravaer.sort.col == column) {
      $fravaer.sort.ascending = !$fravaer.sort.ascending;
    } else {
      $fravaer.sort.col = column;
      $fravaer.sort.ascending = true;
    }

    let sortModifier = $fravaer.sort.ascending ? 1 : -1;
    const parseProcent = (procent) => parseFloat(procent.replace(",", "."));
    let sortFunc = (a, b) => {
      switch (column) {
        case "procent":
          return parseProcent(a.fravær_procent) < parseProcent(b.fravær_procent)
            ? -1 * sortModifier
            : parseProcent(a.fravær_procent) > parseProcent(b.fravær_procent)
            ? 1 * sortModifier
            : 0;
        case "moduler":
          const aValue = /([0-9]+)\//g.exec(a.fravær_moduler)[1];
          const bValue = /([0-9]+)\//g.exec(b.fravær_moduler)[1];
          return aValue < bValue ? -1 * sortModifier : aValue > bValue ? 1 * sortModifier : 0;
        case "hold":
          return a.hold < b.hold ? -1 * sortModifier : a.hold > b.hold ? 1 * sortModifier : 0;
      }
    };
    $fravaer.data.generalt = $fravaer.data.generalt.sort(sortFunc);
  };

  $: sortArrow = (column, sort) => {
    if (column == sort.col) {
      return sort.ascending ? "▲" : "▼";
    } else {
      return "";
    }
  };
</script>

<h1 class="text-3xl font-bold">Fravær</h1>
{#if $fravaer?.data}
  {#if samletFravaer == 0}
    <p>Du har intet fravær</p>
  {:else}
    <p>Du har {samletFravaer}% fravær</p>
    <p>Hold uden fravær er ikke vist</p>
    <div class="mb-4 mt-4">
      <table class="table w-full rounded-xl shadow-xl">
        <thead>
          <tr>
            <th on:click={sort("hold")}>Hold {sortArrow("hold", $fravaer.sort)}</th>
            <th on:click={sort("procent")}>Fravær {sortArrow("procent", $fravaer.sort)}</th>
            <th on:click={sort("moduler")}>Moduler {sortArrow("moduler", $fravaer.sort)}</th>
          </tr>
        </thead>
        <tbody>
          {#each $fravaer.data.generalt as fravaer}
            {#if fravaer.hold != "Samlet" && fravaer.fravær_procent != "0,00%"}
              <tr>
                <td>{fravaer.hold}</td>
                <td>{fravaer.fravær_procent}</td>
                <td>{fravaer.fravær_moduler}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
    <div class="mt-12">
      <h1 class="text-2xl font-bold">Grafisk oversigt</h1>
      <p class="mb-2">Antal fraværende moduler</p>
      <div>
        <div class="h-50v">
          <canvas bind:this={modulerChartElement} />
        </div>
        <div class="mb-9" />
        <div class="h-50v">
          <canvas bind:this={yearChartElement} />
        </div>
      </div>
    </div>
  {/if}
{/if}
