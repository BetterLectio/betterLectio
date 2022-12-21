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

<input type="checkbox" id="besvar-modal" class="modal-toggle" />
<label for="besvar-modal" class="modal modal-bottom sm:modal-middle cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="font-bold text-lg mb-2">Besvar besked</h3>
    <textarea class="textarea textarea-bordered resize-none" placeholder="Besked" style="width: 100%; height: 100%;"></textarea>
    <div class="modal-action">
      <label for="besvar-modal" class="btn cursor-not-allowed">{"Send (Virker ikke)"}</label>
    </div>
  </label>
</label>

<!--
<input type="checkbox" id="besvar-modal" class="modal-toggle" />
<label class="modal modal-bottom sm:modal-middle">
  <label class="modal-box relative" for="">
    <h3 class="font-bold text-lg mb-2">Besvar besked</h3>
    <textarea class="textarea textarea-bordered resize-none" placeholder="Besked" style="width: 100%; height: 100%;"></textarea>
    <div class="modal-action">
      <label for="besvar-modal" class="btn cursor-not-allowed">{"Send (Virker ikke)"}</label>
    </div>
  </label>
</label>
-->
{#if besked}
  <span class="my-2 flex justify-between">
    <h1 class="mb-4 text-3xl font-bold">{besked[0].titel}</h1>
    {#if cookie?.userid}
      <a
        class="btn"
        href={`https://www.lectio.dk/lectio/${cookie.school}/beskeder2.aspx?type=showthread&elevid=${cookie.userid}&id=${beskedId}`}
      >
        Besvar besked
      </a>
    {/if}
  </span>
  <!-- Måske en linje til at seperere beskeder-->
  <div class="p-4 rounded-lg bg-base-200">
  {#each besked as _besked}
    <div class="relative mt-4 p-4 rounded-lg bg-base-300 break-words" style="margin-left: {_besked.padding_left/2}em;">
      <label for="besvar-modal" class="absolute bottom-0 right-0 mb-4 mr-4 btn btn-sm">Besvar</label>
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
        <p class="mb-10">
          {@html sanitizeHtml(md.render(_besked.besked)).replace(
            "<a",
            '<a class="btn btn-xs btn-primary" target="_blank"'
          )}
        </p>
      </div>
    </div>
    {/each}
  </div>
{/if}
