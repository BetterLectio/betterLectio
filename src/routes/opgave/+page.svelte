<script>
  import { page } from "$app/stores";
  import { get } from "$lib/js/http.js";
  import Avatar from "$lib//components/Avatar.svelte";
  import Table from "$lib/components/Table.svelte";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "$lib/js/CookieInfo";
  import { addNotification, addNotificationIn } from "$lib/js/notifyStore.js";
  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  const md = new MarkdownIt();

  const exerciseid = $page.url.searchParams.get("exerciseid");

  let oplysningsItems = {};
  let personAfleveringItems = {};
  let feedbackItems = {};
  let aflevedeOpgaveItems = {};
  let _oplysninger = {};

  let elevId = "";

  get("/opgave?exerciseid=" + exerciseid)
    .then((data) => {
      const { oplysninger, opgave_indlæg, gruppemedlemmer, afleveres_af } = data;

      const { opgavebeskrivelse, opgavenote, opgavetitel, afleveringsfrist, elevtid, hold, karakterskala } = oplysninger;

      const { elev, afventer, status_fravær, afsluttet, karakter, karakternote, elevnote } = afleveres_af;
      elevId = elev.bruger_id.slice(1);

      _oplysninger = {
        opgavetitel,
        opgavebeskrivelse,
        opgavenote,
      };

      oplysningsItems = {
        afleveringsfrist,
        elevtid,
        hold,
        karakterskala,
      };
      personAfleveringItems = {
        elev: elev.navn,
        afventer,
        status_fravær,
        afsluttet: afsluttet ? "Ja" : "Nej",
      };

      feedbackItems = {
        karakter,
        karakternote,
        elevnote,
      };

      aflevedeOpgaveItems = {
        brugerId: elevId,
        indlæg: opgave_indlæg,
        harAfleveret: opgave_indlæg.length > 0,
      };
    })
    .catch(() => {
      addNotification("noget gik galt, vi beklager, her er noget det måske kan hjælpe", "alert-error");
      addNotificationIn("se konsol for mere info", "alert-error", 6000);
      _oplysninger = 0; // to hide ui
    });
</script>

<div>
  {#if _oplysninger}
    <h1 class="mb-4 text-3xl font-bold">{_oplysninger.opgavetitel}</h1>
    <p class="mb-4">{_oplysninger.opgavenote}</p>

    {#if _oplysninger.opgavebeskrivelse}
      <div class="mb-4">
        <h1 class="font-bold">Opgave beskrivelse:</h1>
        {@html sanitizeHtml(md.render(_oplysninger.opgavebeskrivelse))
          .replace(/<a/g, '<a class="btn btn-xs btn-primary" target="_blank"')
          .replace("</a>", "</a><br>")}
      </div>
    {/if}

    <h1 class="text-2xl font-bold">Oplysninger</h1>
    <Table items={oplysningsItems} />

    <h1 class="text-2xl font-bold">Afleveres af</h1>
    <Table items={personAfleveringItems} />

    {#if feedbackItems.karakter}
      <h1 class="text-2xl font-bold">Feedback</h1>
      <Table items={feedbackItems} />
    {/if}

    <h1 class="text-2xl font-bold">Opgave Indlæg</h1>
    {#if aflevedeOpgaveItems.harAfleveret}
      <table class="mb-4 mt-2 table w-full rounded-xl shadow-xl">
        <thead>
          <tr>
            <th />
            <th>Bruger</th>
            <th>Indlæg</th>
            <th>Dokument</th>
            <th>Tidspunkt</th>
          </tr>
        </thead>
        <tbody>
          {#each aflevedeOpgaveItems.indlæg as indlæg}
            <tr>
              <td>
                <Avatar id={indlæg["bruger"]["bruger_id"]} navn={indlæg["bruger"]["navn"]} squared />
              </td>
              <td>{indlæg["bruger"]["navn"]}</td>
              <td>{indlæg["indlæg"]}</td>
              <td>
                {@html sanitizeHtml(md.render(indlæg["dokument"])).replace("<a", '<a class="btn btn-xs btn-primary" target="_blank"')}
              </td>
              <td>{indlæg["tidspunkt"]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if personAfleveringItems?.afsluttet == "Nej"}
        <a
          href="https://www.lectio.dk/lectio/{cookie.school}/ElevAflevering.aspx?elevid={elevId}&exerciseid={exerciseid}"
          target="_blank"
          class="btn-primary btn my-2">Aflever igen</a
        >
      {/if}
    {:else if cookie?.school}
      <a
        href="https://www.lectio.dk/lectio/{cookie.school}/ElevAflevering.aspx?elevid={elevId}&exerciseid={exerciseid}"
        target="_blank"
        class="btn-primary btn my-2">Aflever Her!</a
      >
    {/if}
  {/if}
</div>
