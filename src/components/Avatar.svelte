<script>
  import { api } from "./http.js";

  import IntersectionObserver from "svelte-intersection-observer";

  export let id;
  export let navn;

  export let size = "w-12";

  export let squared = false;

  let element;
  let source;

  async function getImageSource() {
    const response = await fetch(`${api}/profil_billed?id=${id}&fullsize=1`, {
      headers: {
        "lectio-cookie": localStorage.getItem("lectio-cookie"),
      },
    });
    if (response.ok) {
      const base64Response = await response.text();
      /*
    Hvorfor er dette udkommenteret? Det er det fordi cachen på billeder vare i rigtig lang tid og derfor bliver lectio-cookie sat til noget gammelt. Indtil vi har fundet en bedre løsning vil det her være udkommenteret
    if (response.ok) {
      let lectioCookie = await response.headers.get('set-lectio-cookie')
      if (lectioCookie && lectioCookie != "null") {
        localStorage.setItem("lectio-cookie", lectioCookie);
      }
    }*/
      return base64Response;
    } else {
      return null;
    }
  }
</script>

<IntersectionObserver
  {element}
  once={true}
  on:intersect={(e) => {
    getImageSource().then((data) => {
      source = data;
    });
  }}
>
  <div bind:this={element}>
    {#if source}
      <button class="avatar">
        <div class={squared ? `${size} rounded` : `${size} rounded-full`}>
          <img id="${id}" src="data:image/png;base64, {source}" alt="" />
        </div>
      </button>
    {:else}
      <button class="placeholder avatar">
        <div class="rounded-full bg-neutral-focus text-neutral-content {size} {squared ? 'rounded' : 'rounded-full'}">
          <span class="text-xl">{navn ? navn[0] : "?"}</span>
        </div>
      </button>
    {/if}
  </div>
</IntersectionObserver>
