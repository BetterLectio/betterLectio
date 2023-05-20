<script>
  import { api } from "$lib/js/http.js";

  import IntersectionObserver from "svelte-intersection-observer";

  export let id;
  export let navn;

  export let size = "w-12";

  export let squared = false;

  let element;
  let source;

  async function getImageSource() {
    try {
      const response = await fetch(`${api}/profil_billed?id=${id}&fullsize=1`, {
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
      });
      if (response.ok) {
        const base64Response = await response.text();
        return base64Response;
      } else {
        return null;
      }
    } catch (error) {
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
          <img id="${id}" src="data:image/png;base64, {source}" alt="" class="image-full" />
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
