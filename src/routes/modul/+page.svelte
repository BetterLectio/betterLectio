<script>
  import { page } from "$app/stores";
  import { hold } from "$lib/js/store.js";
  import { get } from "$lib/js/http.js";
  import Table from "$lib/components/Table.svelte";
  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "$lib/js/CookieInfo";
  import { HoldOversætter } from "$lib/js/HoldOversætter.js";
  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  const md = new MarkdownIt();
  const absid = $page.url.searchParams.get("absid");

  let modul;
  let lektieHtml = "";
  let øvrigeIndholdHtml = "";
  let note = "";
  let items = {};
  let isOpen = "";

  let linkPreviewBox = "";

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
          '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary preview" target="_blank"'
        );
        lektieHtml += "<p>" + translated + "<p/>";
      });
    }

    if (modul.øvrigtIndhold) {
      await modul.øvrigtIndhold.split("\n").forEach((element) => {
        let translated = sanitizeHtml(md.render(element)).replace(
          "<a",
          '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary preview" target="_blank"'
        );
        øvrigeIndholdHtml += "<p>" + translated + "<p/>";
      });
    }

    if (modul.note) {
      await modul.note.split("\n").forEach((element) => {
        let translated = sanitizeHtml(md.render(element)).replace(
          "<a",
          '<a data-sveltekit-preload-data  class="btn btn-xs btn-primary preview" target="_blank"'
        );
        note += "<p>" + translated + "<p/>";
      });
    }
    previewLink();
    isOpen = "active";
  }
  getModul();

  function previewLink() {
    let links = document.querySelectorAll(".preview");

    console.log(links);
    links.forEach((link) => {
      link.addEventListener("mouseover", (e) => {
        let url = e.target.href;
        console.log(url);
        //add an i frame to the linkpreviewbox div with the url
        if (!url.includes("lectio")) {
          linkPreviewBox = `<iframe src="${url}" width="600" height="400" title="link preview" class="rounded-lg" in:fade out:fade />`;
        }
        // place the linkpreviewbox div under the element
        let rect = e.target.getBoundingClientRect();
        let linkpreviewbox = document.getElementById("linkpreviewbox");
        linkpreviewbox.style.top = rect.bottom + "px";
        linkpreviewbox.style.left = rect.left + "px";

        // on mouse out (btn and linkpreviewbox) remove the i frame
        linkpreviewbox.addEventListener("mouseout", () => {
          linkPreviewBox = "";
        });

        // if the site cant be loaded, remove the i frame
        linkpreviewbox.addEventListener("error", () => {
          linkPreviewBox.remove();
        });
      });
    });
  }
</script>

<div id="linkpreviewbox" class="invisible absolute shadow-2xl md:visible">
  {@html linkPreviewBox}
</div>

<div>
  <span class="my-2 flex justify-between">
    {#if modul}
      <h1 class="text-3xl font-bold">
        {modul.aktivitet.navn ? modul.aktivitet.navn + " - " : ""}{modul.aktivitet.hold
          ? HoldOversætter(modul.aktivitet.hold, $hold)
          : "Ukendt hold"}
      </h1>
    {:else}
      <div class="animate-pulse bg-base-200 rounded-lg h-12 w-1/2" />
    {/if}
    {#if modul}
      <a
        data-sveltekit-preload-data
        class="btn"
        href={`https://www.lectio.dk/lectio/${cookie.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
      >
        Åben Elevfeedback
      </a>
    {/if}
  </span>
  {#if modul}
    <Table {items} />
  {:else}
    <div>
      <div class="w-full h-12 bg-base-200 rounded-t-lg shadow-xl animate-pulse" />
      <div class="w-full h-14 bg-base-100 rounded-b-lg shadow-xl animate-pulse" />
    </div>
  {/if}

  <div class="fromhzerotohauto {isOpen}">
    {#if modul}
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
</div>

<style>
  .fromhzerotohauto {
    max-height: 10px;
    transition: max-height 0.5s ease-in-out;
    overflow: hidden;
  }

  .fromhzerotohauto.active {
    max-height: 1000px;
    height: auto;
    transition: max-height 0.5s ease-in-out;
  }
</style>
