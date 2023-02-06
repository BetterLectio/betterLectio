<script>
  import moment from "moment";
  import { get } from "../../components/http.js";
  import { lektier } from "../../components/store.js";

  let ready = false;

  moment.defineLocale("en-DK", {
    months: "Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),
    weekdays: "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
  });
  const timeRegex =
    /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/m;

  get("/lektier").then((data) => {
    data.forEach((lektie, index) => {
      const timeMatch = timeRegex.exec(lektie.aktivitet.tidspunkt);
      const momentTime = moment(`${timeMatch[1]} ${timeMatch[3]}`, "D/M-YYYY HH:mm");
      let time = "";
      if (momentTime.isSame(moment(), "day")) {
        time = "I dag";
      } else if (momentTime.isSame(moment().add(1, "day"), "day")) {
        time = "I morgen";
      } else {
        time = momentTime.format("dddd D. MMMM");
      }
      data[index].internalDate = time;
    });
    $lektier = data;
    ready = true;
  });

  function seperateAssignmentsByDate() {
    let datoer = [];
    $lektier.forEach((lektie) => {
      if (!datoer.includes(lektie.internalDate)) {
        datoer.push(lektie.internalDate);
      }
    });
    return datoer;
  }
</script>

{#if ready}
  <h1 class="text-3xl font-bold">Lektier</h1>
  <h3 class="mb-4 text-xl">Lektier for de næste 14 dage</h3>
  {#if $lektier.length > 0}
    {#each Object.values(seperateAssignmentsByDate()) as day}
      <h2 class="mb-2 mt-4 text-lg font-bold">{day}</h2>
      <ul>
        {#each $lektier as lektie}
          {#if lektie.internalDate == day}
            <a href="/modul?absid={lektie.aktivitet.absid}">
              <li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4">
                <div>
                  <div class="flex w-full flex-row justify-between">
                    <p>
                      <span class="font-bold"
                        >{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet.hold}</span
                      >
                    </p>
                    <p class="font-light opacity-50">
                      {lektie.aktivitet.tidspunkt.split(" ")[1] + " - " + lektie.aktivitet.tidspunkt.split(" ")[3]}
                    </p>
                  </div>
                  <p>{lektie.lektier.beskrivelse}</p>
                </div>
              </li>
            </a>
          {/if}
        {/each}
      </ul>
    {/each}
  {:else}
    <p>Du har ingen kommende lektier de næste 14 dage</p>
  {/if}
{/if}
