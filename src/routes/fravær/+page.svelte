<script>
  import { Bar, Line } from "svelte-chartjs";
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
  } from "chart.js";
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

  Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

  const timeRegex =
    /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/m;

  let samletFravaer = 0;
  get("/fravaer").then((data) => {
    $fravaer = { sort: { col: "procent", ascending: true }, data };
    $fravaer.data.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        samletFravaer = element.opgjort_fravær_procent;
      }
    });
  });

  let monthToFravær = 0;
  $: if ($fravaer) {
    const concFravær = [...$fravaer.data.moduler.manglende_fraværsårsager, ...$fravaer.data.moduler.oversigt];
    let monthToFravær = Object.assign({}, ...moment.months().map((monthName) => ({ [monthName]: 0 })));

    for (let index = 0; index < concFravær.length; index++) {
      const modul = concFravær[index].aktivitet;
      const tidspunkt = modul.tidspunkt.match(timeRegex);
      const date = moment(`${tidspunkt[1]} ${tidspunkt[2]}`, "DD/MM-YYYY HH:mm");
      monthToFravær[date.format("MMMM")] = monthToFravær[date.format("MMMM")] + 1;
    }
  }

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
</script>

{#if $fravaer?.data?.generalt}
  <Bar
    data={{
      labels: $fravaer.data.generalt
        .filter((element) => element.hold != "Samlet" && element.opgjort_fravær_procent != "0,00%")
        .map((element) => element.hold),
      datasets: [
        {
          label: "Fraværende moduler",
          data: $fravaer.data.generalt
            .filter((element) => element.hold != "Samlet" && element.opgjort_fravær_procent != "0,00%")
            .map((element) => /(\d+\,?\d*|\,\d+)\//g.exec(element.opgjort_fravær_moduler)[1].replace(",", ".")),
          backgroundColor: $fravaer.data.generalt.map(
            (element, index) => BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]
          ),
        },
      ],
    }}
  />
{/if}

{#if monthToFravær && moment}
  <Line
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
