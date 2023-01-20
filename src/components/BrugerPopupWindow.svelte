<script>
  import { start_hydrating } from "svelte/internal";
  import Avatar from "./Avatar.svelte";
  import { get } from "./http.js";

  export let navn;
  export let id;

  let skema;
  let aktivitet;
  get(`/skema?id=${id}`).then((data) => {
    skema = data;

    skema["moduler"].forEach((modul) => {
      let start = modul["tidspunkt"].split(" til ")[0];
      start = {
        dag: start.split("/")[0].length == 1 ? "0" + start.split("/")[0] : start.split("/")[0],
        måned:
          start.split("/")[1].split("-")[0].length == 1
            ? "0" + start.split("/")[1].split("-")[0]
            : start.split("/")[1].split("-")[0],
        år: start.split("-")[1].split(" ")[0],

        tidspunkt: start.split(" ")[1],
      };
      let slut = modul["tidspunkt"].split(" ")[0] + " " + modul["tidspunkt"].split(" til ")[1];
      slut = {
        dag: slut.split("/")[0].length == 1 ? "0" + slut.split("/")[0] : slut.split("/")[0],
        måned:
          slut.split("/")[1].split("-")[0].length == 1
            ? "0" + slut.split("/")[1].split("-")[0]
            : slut.split("/")[1].split("-")[0],
        år: slut.split("-")[1].split(" ")[0],

        tidspunkt: slut.split(" ")[1],
      };

      modul.start = new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`);
      modul.slut = new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`);

      let now = new Date(Date.now());

      if (now >= modul.start && now <= modul.slut) {
        aktivitet = modul;
      }
    });
  });
</script>

{#if skema}
  <div class="card w-96 shadow-2xl">
    <div class="card-body">
      <Avatar {id} {navn} size="w-24" clickable={false} />
      <h2 class="card-title">{navn}</h2>
      {#if skema["type"] == "elev"}
        <p>
          <strong>Grupper:</strong>
          {#each skema["grupper"] as gruppe}
            <a href="/skema?id=HE{gruppe['id']}" class="btn-primary btn-xs btn mr-1">{gruppe["navn"]}</a>
          {/each}
        </p>
      {:else if skema["type"] == "lærer"}
        <p>
          <strong>Hold:</strong>
          {#each Object.entries(skema["hold"]) as hold}
            <a href="/skema?id=HE{hold[1]}" class="btn-primary btn-xs btn mr-1">{hold[0]}</a>
          {/each}
        </p>
      {/if}
      <p><strong>Aktivitet:</strong> {aktivitet == undefined ? "Fri" : `${aktivitet} i lokale ${aktivitet.lokale}`}</p>
      <div class="card-actions mt-4 justify-start">
        <button class="btn-primary btn">Se skema</button>
        <button class="btn-primary btn">Send besked</button>
      </div>
    </div>
  </div>
{/if}
