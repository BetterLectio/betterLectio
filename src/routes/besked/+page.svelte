<script>
  import Avatar from "../../components/Avatar.svelte";
  import Brugernavn from "../../components/Brugernavn.svelte";
  import { get } from "../../components/http";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  const md = new MarkdownIt();

  const beskedId = new URLSearchParams(window.location.search).get("id");

  const CokieInfo = async () => {
    if (!localStorage.getItem("authentication")) {
      console.log("Redirect");
      window.location.href = "/auth";
    } else {
      let decodedCookie = atob(localStorage.getItem("authentication"));
      cookie = JSON.parse(decodedCookie);
      return {
        user: cookie["LastLoginUserName"],
        school: cookie["LastLoginExamno"],
        userid: cookie["LastLoginElevId"],
      };
    }
  };

  let cookie;
  CokieInfo().then((data) => {
    cookie = data;
  });

  let besked;
  get("/besked?id=" + beskedId).then((data) => {
    besked = data;
  });
</script>

{#if besked}
  <span class="my-2 flex justify-between">
    <h1 class="mb-4 text-3xl font-bold">{besked[0].titel}</h1>
    {#if cookie?.userid}
      <a
        class="btn"
        href={`https://www.lectio.dk/lectio/681/beskeder2.aspx?type=showthread&elevid=${cookie.userid}&id=${beskedId}`}
      >
        Besvar besked
      </a>
    {/if}
  </span>
  <!-- Måske en linje til at seperere beskeder-->
  {#each besked as _besked}
    <div class="mt-4" style="padding-left: {_besked.padding_left}em;">
      <div class="flex items-center">
        <Avatar id={_besked.bruger.id} navn={_besked.bruger.navn} size="w-14" clickable />
        <div class="ml-4">
          <Brugernavn className="text-xl font-bold" navn={_besked.bruger.navn} id={_besked.bruger.id} />
          <p>{_besked.dato}</p>
        </div>
      </div>

      <div class="mt-4 mb-4">
        {#each _besked.vedhæftninger as vedhæftning}
          <a class="btn btn-primary btn-xs mr-1 mb-4" href={vedhæftning.href}>{vedhæftning.navn}</a>
        {/each}
        <p>
          {@html sanitizeHtml(md.render(_besked.besked)).replace(
            "<a",
            '<a class="btn btn-xs btn-primary" target="_blank"'
          )}
        </p>
      </div>
      <div class="flex-grow border-t border-gray-400" />
    </div>
  {/each}
{/if}
