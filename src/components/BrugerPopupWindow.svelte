<script>
  import Avatar from "./Avatar.svelte";
  import { get } from "./http.js";

  export let navn;
  export let id;

  let skema;
  get(`/skema?id=${id}`).then((data) => {
    skema = data;
  });
</script>

{#if skema}
  <div class="card w-96 shadow-2xl">
    <div class="card-body">
      <Avatar {id} {navn} size="w-24" clickable={false} />
      <h2 class="card-title">{navn}</h2>
      <p>Dataen herunder er et eksempel på hvordan brugerdropdown kan se ud. Dataen er altså ikke korekt.</p>
      {#if skema["type"] == "elev"}
        <p><strong>Grupper:</strong>
          {#each skema["grupper"] as gruppe}
            <a href="/skema?id=HE{gruppe["id"]}" class="btn btn-xs btn-primary mr-1">{gruppe["navn"]}</a>
          {/each}
        </p>
      {:else if skema["type"] == "lærer"}
      <p><strong>Hold:</strong>
        {#each Object.entries(skema["hold"]) as hold}
          <a href="/skema?id=HE{hold[1]}" class="btn btn-xs btn-primary mr-1">{hold[0]}</a>
        {/each}
      </p>
        
      {/if}
      <p><strong>Aktivitet:</strong> {["Matematik i lokale 2.04", "Fri"][Math.floor(Math.random() * 2)]}</p>
      <div class="card-actions mt-4 justify-start">
        <button class="btn-primary btn">Se skema</button>
        <button class="btn-primary btn">Send besked</button>
      </div>
    </div>
  </div>
{/if}