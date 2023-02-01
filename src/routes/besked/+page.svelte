<script>
  import Avatar from "../../components/Avatar.svelte";
  import BrugerPopup from "../../components/BrugerPopup.svelte";
  import { get, api } from "../../components/http";
  import { addNotification } from "../../components/notifyStore.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

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
    titel = _besked.titel.indexOf("Re:") > -1 ? "Re: " + besked[0].titel : "Re: " + _besked.titel;
    id = _besked.id;
    checked == "checked" ? (checked = "") : (checked = "checked");
  }
  async function sendBesked() {
    const response = await fetch(`${api}/besvar_besked`, {
      method: "POST",
      headers: {
        "lectio-cookie": localStorage.getItem("lectio-cookie"),
      },
      body: JSON.stringify({
        message_id: beskedId,
        id: id,
        titel: titel,
        content: content,
      }),
    });
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
</script>

<input type="checkbox" id="besvar-modal" class="modal-toggle" bind:checked />
<label for="besvar-modal" class="modal modal-bottom cursor-pointer sm:modal-middle">
  <label class="modal-box relative" for="">
    <input type="text" placeholder={titel} bind:value={titel} class="input-ghost input mb-2 text-lg font-bold" />
    <textarea
      class="textarea-bordered textarea resize-none"
      placeholder="Besked"
      bind:value={content}
      style="width: 100%; height: 100%;"
    />
    <div class="modal-action">
      <label for="besvar-modal" on:click={sendBesked} class="btn">Send</label>
    </div>
  </label>
</label>

{#if besked}
  <h1 class="mb-2 text-3xl font-bold">{besked[0].titel}</h1>
  <p class="mb-4"><strong>Modtagere:</strong> {modtagere}</p>
  <!-- Måske en linje til at seperere beskeder-->
  <div class="rounded-lg bg-base-200 p-4">
    {#each besked as _besked}
      <div class="relative mt-4 break-words rounded-lg bg-base-300 p-4" style="margin-left: {_besked.padding_left / 2}em;">
        <button class="btn-sm btn absolute bottom-0 right-0 mb-4 mr-4" on:click={() => handleClick(_besked)}>Besvar</button>
        <BrugerPopup navn={_besked.bruger.navn} id={_besked.bruger.id}>
          <div class="flex">
            <Avatar id={_besked.bruger.id} navn={_besked.bruger.navn} size="w-14" />
            <div class="ml-4">
              <p class="text-xl font-bold">{_besked.bruger.navn}</p>
              <p class="text-left">{_besked.dato}</p>
            </div>
          </div>
        </BrugerPopup>

        <div class="mt-4 mb-4">
          {#each _besked.vedhæftninger as vedhæftning}
            <a class="btn-primary btn-xs btn mr-1 mb-4" href={vedhæftning.href}>{vedhæftning.navn}</a>
          {/each}
          <p class="mb-10">
            {sanitizeHtml(md.render(_besked.besked)).replaceAll("<p>", "").replaceAll("</p>", "")}
          </p>
        </div>
      </div>
    {/each}
  </div>
{/if}
