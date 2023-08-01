<script>
  import { indstillinger, hold } from "$lib/js/store";
  import { get, reloadData } from "$lib/js/http.js";

  let windowWidth = window.innerWidth;

  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);

  function onDelete(i) {
    console.log($hold[i], i, $hold);
    $hold.splice(i, 1);
    $hold = $hold;
  }

  let fag = "",
    forkortelse = "";
  function addHold() {
    //TODO: if already present dont add

    $hold.push({ forkortelse: forkortelse, fag: fag });
    $hold = $hold;
  }

  let terminer;
  get("/terminer").then((data) => {
    terminer = data;
  });

  function aendreTermin(btn) {
    terminer = null;

    let id = btn.srcElement.id.toString();
    get(`/aendre_termin?id=${id}`).then((data) => {
      if (data.success) {
        terminer.selected = id;
      } else {
        alert("Der skete en fejl ved ændringen af terminet");
      }
    });

    reloadData();
  }
</script>

<h1 class="heading">Indstillinger - Generelt</h1>

<div class="rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Layout</span>
    <p>Skift imellem sidebar og topbar layout på store skærme</p>
    <label class="label cursor-pointer">
      <span class="label-text">Sidebar</span>
      <input
        type="checkbox"
        class="checkbox"
        on:click={() => {
          location.reload();
        }}
        bind:checked={$indstillinger.sidebar}
        disabled={windowWidth > 768 ? "" : "disabled"}
      />
    </label>
    <p class="text-error">{windowWidth < 768 ? "Ikke understøttet på din enhed" : ""}</p>
  </div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Opgaver siden</span>

    <label class="label cursor-pointer">
      <span class="label-text">Vis absolut frist</span>
      <input type="checkbox" class="checkbox" bind:checked={$indstillinger.opgaver.visFristAbsolut} />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">Vis hele opgavenoten</span>
      <input type="checkbox" class="checkbox" bind:checked={$indstillinger.opgaver.visHeleBeskrivelsen} />
    </label>
  </div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Skema siden</span>

    <label class="label cursor-pointer">
      <span class="label-text">Få forskellige farver på dine moduler</span>
      <input type="checkbox" class="checkbox" bind:checked={$indstillinger.skema.classesWithDiffrentColors} />
    </label>
  </div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Fag Oversætter</span>
  </div>
  <label class="label cursor-pointer">
    <span class="label-text">Fag Oversætter</span>
    <input type="checkbox" class="checkbox" bind:checked={$indstillinger.brugHoldOversætter} />
  </label>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Termin</span>
    <p>Skift dit termin</p>
  </div>
  {#if terminer}
    {#each Object.entries(terminer.terminer) as termin}
      <label class="label cursor-pointer">
        <span class="label-text">{termin[1]}</span>
        <input
          type="checkbox"
          class="checkbox"
          checked={termin[0] == terminer.selected ? "checked" : ""}
          id={termin[0]}
          on:click={aendreTermin}
        />
      </label>
    {/each}
  {:else}
    <span class="loading loading-dots loading-lg" />
  {/if}
</div>
