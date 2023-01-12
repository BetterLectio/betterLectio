<script>
  import Avatar from "./Avatar.svelte";

  export let navn;
  export let id;
</script>

<div class="card glass w-96">
  <div class="card-body">
    <Avatar {id} {navn} size="w-24" clickable={false} />
    <h2 class="card-title">{navn}</h2>
    <p>Dataen herunder er et eksempel på hvordan brugerdropdown kan se ud. Dataen er altså ikke korekt.</p>
    <p><strong>Hold & grupper:</strong> {"Alle 1. HTX-elever (Lyn), Programmeringsklubben"}</p>
    <p><strong>Aktivitet:</strong> {["Matematik i lokale 2.04", "Fri"][Math.floor(Math.random() * 2)]}</p>
    <div class="card-actions mt-4 justify-start">
      <button class="btn-primary btn">Se skema</button>
      <button class="btn-primary btn">Send besked</button>
    </div>
  </div>
</div>
