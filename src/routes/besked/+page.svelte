<script>
  import Avatar from "$lib/components/Avatar.svelte";
  import BrugerPopup from "$lib/components/BrugerPopup.svelte";
  import { get, api } from "$lib/js/http";
  import { addNotification } from "$lib/js/notifyStore.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  import { cookieInfo } from "$lib/js/CookieInfo";
  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  let updating = false;

  const md = new MarkdownIt();

  const beskedId = new URLSearchParams(window.location.search).get("id");

  let besked;

  let linkPreviewBox = "";

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

  function updateBesked() {
    updating = true;
    addNotification("opdaterer beskedtråden", "alert-info");
    get("/besked?id=" + beskedId).then((data) => {
      besked = data.beskeder;
      modtagere = data.modtagere;
      updating = false;
    });
  }

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

<div id="linkpreviewbox" class="invisible absolute z-50 shadow-2xl md:visible">
  {@html linkPreviewBox}
</div>

<input type="checkbox" id="besvar-modal" class="modal-toggle" bind:checked />
<label for="besvar-modal" class="modal modal-bottom cursor-pointer sm:modal-middle">
  <label class="modal-box relative" for="">
    <input type="text" placeholder={titel} bind:value={titel} class="input-ghost input mb-2 text-lg font-bold" />
    <textarea class="textarea-bordered textarea resize-none" placeholder="Besked" bind:value={content} style="width: 100%; height: 100%;" />
    <div class="modal-action">
      <label for="besvar-modal" on:click={sendBesked} class="btn">Send</label>
    </div>
  </label>
</label>

{#if besked}
  <div class="flex-rox flex w-full justify-between">
    <h1 class="mb-2 text-3xl font-bold">{besked[0].titel}</h1>
    <button class={`btn-circle btn ml-4 ${updating ? "animate-spin" : ""}`} on:click={updateBesked}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
        <path
          d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
        />
        <path
          fill-rule="evenodd"
          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
        />
      </svg>
    </button>
  </div>
  <p class="mb-4"><strong>Modtagere:</strong> {modtagere}</p>
  <!-- Måske en linje til at seperere beskeder-->
  <div class="divide-y divide-base-content rounded-none md:divide-none md:rounded-lg md:bg-base-200 md:p-4">
    {#each besked as _besked}
      <div class="relative mt-4 break-words p-2 md:rounded-lg md:bg-base-300 md:p-4" style="margin-left: {_besked.padding_left / 2}em;">
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
            <a data-sveltekit-preload-data class="btn-primary btn-xs btn mr-1 mb-4" href={vedhæftning.href}>{vedhæftning.navn}</a>
          {/each}
          <p class="mb-10" use:previewLink>
            {@html sanitizeHtml(md.render(_besked.besked)).replace(
              "<a",
              '<a data-sveltekit-preload-data class="btn btn-xs btn-primary preview" target="_blank"'
            )}
          </p>
        </div>
      </div>
    {/each}
  </div>
{/if}
