<script>
  import { page } from "$app/stores";
  import { get } from "../../components/http.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  const md = new MarkdownIt();

  const absid = $page.url.searchParams.get("absid");

  let modul;
  let lektieHtml = "";
  let øvrigeIndholdHtml = "";
  let note = "";
  let ready = false;

  async function getModul() {
    modul = await get(`/modul?absid=${absid}`);
    console.log("modul", modul);
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

    ready = true;
    console.log("ready", lektieHtml);
  }
  getModul();
</script>

<div>
  {#if ready}
    <h1 class="text-3xl font-bold">
      {modul.aktivitet.navn != null ? modul.aktivitet.navn + " - " : ""}{modul.aktivitet.hold}
    </h1>
    <p><strong>Tidspunkt: </strong>{modul.aktivitet.tidspunkt}</p>
    <p><strong>Lokale: </strong>{modul.aktivitet.lokale}</p>
    <p class="mb-4"><strong>Lærer: </strong>{modul.aktivitet.lærer}</p>

    {#if lektieHtml}
      <h3 class="text-xl font-bold">Lektier</h3>
      {@html lektieHtml}
      <div class="mb-4" />
    {/if}

    {#if øvrigeIndholdHtml}
      <h3 class="text-xl font-bold">Øvrigt indhold</h3>
      {@html øvrigeIndholdHtml}
      <div class="mb-4" />
    {/if}

    {#if note}
      <h3 class="text-xl font-bold">Noter</h3>
      {@html note}
      <div class="mb-4" />
    {/if}

    {#if lektieHtml && øvrigeIndholdHtml && note}
      <p>Aktiviteten har ikke noget indhold.</p>
      <div class="mb-4" />
    {/if}
  {/if}
</div>
