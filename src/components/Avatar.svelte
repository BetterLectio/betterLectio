<script>
  export let id;

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

<div class="avatar">
  <div class="w-12 rounded-full">
    {#if source}
      <img id="${id}" src="data:image/png;base64, {source}" alt="" />
    {:else}
      <img id="${id}" src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png" alt="" />
    {/if}
  </div>
</div>
