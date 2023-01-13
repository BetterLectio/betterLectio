<script>
  import { get } from "./http.js";
  import Avatar from "./Avatar.svelte";

  export let navn;
  export let id;

  let brugerData = null;
  get("/skema?id=" + id).then((data) => {
    brugerData = data;
  });
  function getGrupperAsString(grupper) {
    let gruppeNavne = [];
    grupper.forEach((gruppe) => {
      gruppeNavne.push(gruppe.navn);
    });
    return gruppeNavne.join(", ");
  }
</script>

<div class="card w-96 shadow-2xl">
  <div class="card-body">
    <Avatar {id} {navn} size="w-24" clickable={false} />
    <h2 class="card-title">{navn}</h2>
    {#if brugerData !== null}
      {#if brugerData?.grupper}
        <p>
          <strong>Hold & grupper:</strong>
          {getGrupperAsString(brugerData?.grupper)}
        </p>
      {/if}

      <p><strong>Aktivitet:</strong> {brugerData?.aktivitet}</p>
      <div class="card-actions mt-4 justify-start">
        <button class="btn-primary btn">Se skema</button>
        <button class="btn-primary btn">Send besked</button>
      </div>
    {:else}
      <div class="text-center">Henter brugerData...</div>
    {/if}
  </div>
</div>
