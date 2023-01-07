<script>
  import Avatar from "../../components/Avatar.svelte";
  import Brugernavn from "../../components/Brugernavn.svelte";
  import { get } from "../../components/http";
  import { addNotification } from "../../components/notifyStore.js";
  import InfiniteLoading from "svelte-infinite-loading";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  cookieInfo().then(data => {
    cookie = data;
  })

  const md = new MarkdownIt();

  const beskedId = new URLSearchParams(window.location.search).get("id");


  let besked;
  let modtagere;
  get("/besked?id=" + beskedId).then((data) => {
    besked = data.beskeder;
    modtagere = data.modtagere;
  });

  let checked = "";
  let titel = "";
  let content = "";
  let id = "";
  function handleClick(_besked) {
    titel = (_besked.titel.indexOf("Re:") > -1) ? "Re: " + besked[0].titel : "Re: " + _besked.titel;
    id = _besked.id;
    (checked == "checked") ? checked = "": checked = "checked";
  }
  async function sendBesked() {
    const response = await fetch(
      `https://api.betterlectio.dk/besvar_besked`,
      {
        method: "POST", 
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
        body: JSON.stringify({
          message_id: beskedId,
          id: id,
          titel: titel,
          content: content
        })
      }
    );
    if (!response.ok) {
      addNotification("Beskeden kunne ikke sendes, prøv igen senere.", "alert-error");
    } else {
      addNotification("Beskeden blev sendt.", "alert-success");
    }
    get("/besked?id=" + beskedId).then((data) => {
      besked = data.beskeder;
      modtagere = data.modtagere;
    });
  }

  let page = 1;
  let list = [];

  function infiniteHandler({ detail: { loaded, complete } }) {
    let data = besked.slice((page - 1) * 10, page * 10);
    if (data.length) {
      page += 1;
      list = [...list, ...data];
      loaded();
    } else {
      complete();
    }
    if (besked.length < 10) {
      list = besked;
      complete();
    }
  }
</script>

<input type="checkbox" id="besvar-modal" class="modal-toggle" bind:checked={checked} />
<label for="besvar-modal" class="modal modal-bottom sm:modal-middle cursor-pointer">
  <label class="modal-box relative" for="">
    <input type="text" placeholder={titel} bind:value={titel} class="input input-ghost font-bold text-lg mb-2" />
    <textarea class="textarea textarea-bordered resize-none" placeholder="Besked" bind:value={content} style="width: 100%; height: 100%;"></textarea>
    <div class="modal-action">
      <label for="besvar-modal" on:click={sendBesked} class="btn">Send</label>
    </div>
  </label>
</label>

{#if besked}
    <h1 class="mb-2 text-3xl font-bold">{besked[0].titel}</h1>
  <p class="mb-4"><strong>Modtagere:</strong> {modtagere}</p>
  <!-- Måske en linje til at seperere beskeder-->
  <div class="p-4 rounded-lg bg-base-200">
  {#each list as _besked}
    <div class="relative mt-4 p-4 rounded-lg bg-base-300 break-words" style="margin-left: {_besked.padding_left/2}em;">
      <button class="absolute bottom-0 right-0 mb-4 mr-4 btn btn-sm" on:click={() => handleClick(_besked)}>Besvar</button>
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
  <InfiniteLoading on:infinite={infiniteHandler} />
{/if}
