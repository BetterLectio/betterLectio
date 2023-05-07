<script>
  import { indstillinger, hold } from "$lib/js/store";

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
</script>

<h1 class="mb-4 text-3xl font-bold">Indstillinger - Generelt</h1>

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
