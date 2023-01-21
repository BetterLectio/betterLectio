<script>
  import { Doughnut } from "svelte-chartjs";
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
  import moment from "moment";

  import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  let ready = false;
  cookieInfo().then((data) => {
    cookie = data;
    ready = true;
  });

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

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

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

<h1 class="mb-4 text-3xl font-bold">Fravær</h1>
<div class="flex flex-col lg:flex-row w-full p-4 rounded-lg bg-base-200 ">
  <div class="w-full lg:w-1/2 bg-base-300 rounded-lg p-4">
    <h2 class="text-2xl font-bold">Grafisk oversigt</h2>
    {#if $fravaer?.data?.generalt}
    <Doughnut
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
  <div class="w-full bg-base-300 rounded-lg p-4 lg:ml-4 mt-4 lg:mt-0 overflow-y-scroll">
      <h2 class="text-2xl font-bold mb-4">Manglende fraværsårsager</h2>
      <div class="overflow-x-auto">
        {#if ready}
        <table class="table table-zebra w-full">
          <!-- head -->
          <thead>
            <tr>
              <th>modul</th>
              <th>dato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            {#each $fravaer?.data?.moduler?.manglende_fraværsårsager as modul}
              <tr>
                <td>{modul.aktivitet.navn == null ? modul.aktivitet.hold : modul.aktivitet.navn}</td>
                <td>{modul.aktivitet.tidspunkt}</td>
                <td> <a href="{"https://www.lectio.dk/lectio/"+cookie.school+"/fravaer_aarsag.aspx?elevid="+ cookie.userid +"&id="+ modul.aktivitet.absid +"&atype=aa"}" class="btn btn-xs">Skriv fraværsårsag</a></td>
              </tr>
            {/each}
          </tbody>
        </table>
        {/if}
      </div>
  </div>
</div>

