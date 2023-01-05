<script>
  import { element } from "svelte/internal";
import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  let indhold;
  cookieInfo().then((data) => {
    cookie = data;
    indhold = {
      "Better Lectio": [
        {
          title: "Hvornår har jeg fri?",
          link: "/værktøjer/fri",
          description: "Viser dig hvornår du har fri",
          status: "BETA",
        },
        {
          title: "Elev liste",
          link: "/værktøjer/elever",
          description: "Viser dig en liste over alle elever",
          status: "BETA",
        },
        {
          title: "Find ledige lokaler",
          link: "/værktøjer/ledigelokaler",
          description: "Viser dig en liste over alle ledige lokaler",
          status: "BETA",
        },
      ],
      "Lectio (Vi arbejder på at flytte disse sider til Better Lectio)": [
        {
          title: "Karakterer",
          link: `https://www.lectio.dk/lectio/${cookie.school}/grades/grade_report.aspx?elevid=${cookie.userid}`,
          new_tab: true,
          description: "Viser dig dine karakterer",
          status: "WIP",
        },
        {
          title: "Bøger",
          link: `https://www.lectio.dk/lectio/${cookie.school}/BD/UserReservations.aspx?ElevID=${cookie.userid}`,
          new_tab: true,
          description: "Viser dig dine bøger",
          status: "WIP",
        },
        {
          title: "Spørgeskema",
          link: `https://www.lectio.dk/lectio/${cookie.school}/spoergeskema/spoergeskema_rapport.aspx?type=mine&elevid=${cookie.userid}`,
          new_tab: true,
          description: "Viser dig dine spørgeskemaer",
          status: "WIP",
        },
      ],
      Eksterne: [
        {
          title: "Konverter din matematikopgave til et valgfrit format",
          link: "https://www.asguho.dk/mathformatter",
          new_tab: true,
          description: "Konverter din matematikopgave til et valgfrit format",
          status: "BETA",
        },
      ],
    };
  });
</script>

{#if cookie}
  {#each Object.entries(indhold) as [sectionTitel, elements]}
    <ul class="list mb-4">
      <h1 class="mb-4 text-2xl font-bold">{sectionTitel}</h1>
      {#each elements as element}
        <a class="flex-row " href={element.link} target={(element.new_tab) ? "_blank" : ""}>
          <li class="element flex border-l-0 border-primary transition-all duration-100 hover:border-l-4">
            <span part="afsender" class="btn-xs btn mr-4 w-fit">{element.status}</span>
            <span part="emne" class="text-lg font-bold">{element.title}</span>
            <!-- <span part="emne" class="text-sm font-bold">{element.description}</span> -->
          </li>
        </a>
      {/each}
    </ul>
  {/each}
{/if}
