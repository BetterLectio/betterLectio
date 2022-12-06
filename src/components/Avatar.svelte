<script>
  export let id;
  export let navn;

  export let size = "w-12";

  export let squared;

  let source;

  async function getImageSource() {
    const response = await fetch(
      `https://better-lectio-flask-backend.vercel.app/profil_billed?id=${id}&fullsize=1`,
      {
        headers: {
          "lectio-cookie": localStorage.getItem("authentication"),
        },
      }
    );
    const base64Response = await response.text();
    return base64Response;
  }

  getImageSource().then((data) => {
    source = data;
  });
</script>

{#if source}
    <div class="avatar">
      <div class={squared ? `${size} rounded` : `${size} rounded-full`}>
        <img id="${id}" src="data:image/png;base64, {source}" alt="" />
      </div>
    </div>
{:else if navn}
  <div class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content rounded-full {size} {(squared) ? "rounded" : "rounded-full"}">
      <span class="text-xl">{navn[0]}</span>
    </div>
  </div>
{:else}
  <div class="avatar placeholder">
    <div class="bg-neutral-focus text-neutral-content rounded-full {size} {(squared) ? "rounded" : "rounded-full"}">
      <span class="text-xl">?</span>
    </div>
  </div>
{/if}
