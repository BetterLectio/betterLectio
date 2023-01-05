<script>
  import { page } from "$app/stores";
  import { get } from "../../components/http.js";
  import Table from "../../components/Table.svelte";
  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  cookieInfo().then(data => {
    cookie = data;
  })

  const md = new MarkdownIt();
  const absid = $page.url.searchParams.get("absid");

  let modul;
  let lektieHtml = "";
  let øvrigeIndholdHtml = "";
  let note = "";
  let items = {};

  async function getModul() {
    modul = await get(`/modul?absid=${absid}`);

    items = {
      Tidspunkt: modul?.aktivitet?.tidspunkt,
      Lokale: modul?.aktivitet?.lokale,
      Lærer: modul?.aktivitet?.lærer,
    };

    if (modul.lektier) {
      await modul.lektier.split("\n").forEach((element) => {
        let translated = sanitizeHtml(md.render(element)).replace(
          "<a",
          '<a class="btn btn-xs btn-primary" target="_blank"'
        );
        lektieHtml += "<p>" + translated + "<p/>";
      });
    }

    if (modul.øvrigtIndhold) {
      await modul.øvrigtIndhold.split("\n").forEach((element) => {
        let translated = sanitizeHtml(md.render(element)).replace(
          "<a",
          '<a class="btn btn-xs btn-primary" target="_blank"'
        );
        øvrigeIndholdHtml += "<p>" + translated + "<p/>";
      });
    }

    if (modul.note) {
      await modul.note.split("\n").forEach((element) => {
        let translated = sanitizeHtml(md.render(element)).replace(
          "<a",
          '<a class="btn btn-xs btn-primary" target="_blank"'
        );
        note += "<p>" + translated + "<p/>";
      });
    }
  }
  getModul();
</script>

<div>
  {#if modul}
    <span class="my-2 flex justify-between">
      <h1 class="text-3xl font-bold">
        {modul.aktivitet.navn ? modul.aktivitet.navn + " - " : ""}{modul.aktivitet.hold}
      </h1>
      <a
        class="btn"
        href={`https://www.lectio.dk/lectio/${cookie.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
      >
        Åben Elevfeedback
      </a>
    </span>

    <Table {items} />

    {#if lektieHtml}
      <h3 class="text-xl font-bold">Lektier</h3>
      {@html lektieHtml}
      <div class="mb-4" />
    {/if}
    {#if note}
      <h3 class="text-xl font-bold">Noter</h3>
      {@html note}
      <div class="mb-4" />
    {/if}
    {#if øvrigeIndholdHtml}
      <h3 class="text-xl font-bold">Øvrigt indhold</h3>
      {@html øvrigeIndholdHtml}
      <div class="mb-4" />
    {/if}

    {#if !lektieHtml && !øvrigeIndholdHtml && !note}
      <p>Aktiviteten har ikke noget indhold.</p>
      <div class="mb-4" />
    {/if}
  {/if}
</div>
