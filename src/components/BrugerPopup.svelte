<script>
    import Avatar from "./Avatar.svelte";

    export let navn;
    export let id;
</script>

{#if window.innerWidth > 640}
    <div class="card w-96 glass">
        <div class="card-body">
            <Avatar id={id} navn={navn} size="w-24" clickable={false}></Avatar>
            <h2 class="card-title">{navn}</h2>
            <p>Dataen herunder er et eksempel på hvordan brugerdropdown kan se ud. Dataen er altså ikke korekt.</p>
            <p><strong>Hold & grupper:</strong> {"Alle 1. HTX-elever (Lyn), Programmeringsklubben"}</p>
            <p><strong>Aktivitet:</strong> {["Matematik i lokale 2.04", "Fri"][Math.floor(Math.random() * 2)]}</p>
            <div class="mt-4 card-actions justify-start">
                <button class="btn btn-primary">Se skema</button>
                <button class="btn btn-primary">Send besked</button>
            </div>
        </div>
    </div>
{:else}
    <!-- Ukommenteret for nu
    <div>
        <input type="checkbox" id="my-modal-6" class="modal-toggle" checked="checked"/>
        <div class="modal modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Congratulations random Internet user!</h3>
            <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
            <div class="modal-action">
            <label for="my-modal-6" class="btn">Yay!</label>
            </div>
        </div>
        </div>
    </div>
    -->
{/if}