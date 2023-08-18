<script>
  import { get } from "$lib/js/http";

  export let lektie;

  let linksArr = [];
  let showLinks = false;

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";
  import { fly } from "svelte/transition";

  const md = new MarkdownIt();

  get(`/modul?absid=${lektie.aktivitet.absid}`).then((modulData) => {
    const links = modulData.lektier.match(/\[.*\]\(.*\)/g);
    if (links == null) {
      return;
    }

    links.forEach((link) => {
      const linkHtml = sanitizeHtml(md.render(link)).replace("<a", '<a  class="btn btn-xs btn-outline" target="_blank"');

      linksArr.push(linkHtml);
    });
    showLinks = true;
  });
</script>

<a href="/modul?absid={lektie.aktivitet.absid}">
  <li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
    <div>
      <div class="flex w-full flex-row justify-between">
        <p>
          <span class="font-bold">{lektie.aktivitet.navn != null ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet.hold}</span>
        </p>
        <p class="font-light opacity-50">
          {lektie.aktivitet.tidspunkt.split(" ")[1] + " - " + lektie.aktivitet.tidspunkt.split(" ")[3]}
        </p>
      </div>
      <p>{lektie.lektier.beskrivelse}</p>
      {#if showLinks}
        <div in:fly={{ y: -30 }}>
          <div class="divider">Links og filer</div>
        </div>
        <div in:fly={{ y: -30, delay: 300 }}>
          <!-- cards -->
          {@html linksArr}
        </div>
      {/if}
    </div>
  </li>
</a>
