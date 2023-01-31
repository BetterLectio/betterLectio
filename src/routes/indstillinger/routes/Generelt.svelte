<script>
  import { indstillinger } from "../../../components/store";

  $indstillinger ||= {};
  $indstillinger.sidebar ||= false;
  $indstillinger.opgaver ||= {};
  $indstillinger.opgaver.visFristAbsolut ||= false;
  $indstillinger.opgaver.visHeleBeskrivelsen ||= false;

  $indstillinger.skema ||= {};
  $indstillinger.skema.classesWithDiffrentColors ||= false;

  let windowWidth = window.innerWidth;

  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);
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
        class="checkbox "
        bind:checked={$indstillinger.sidebar}
        disabled={windowWidth > 768 ? "" : "disabled"}
      />
    </label>
    <p class="text-error ">{windowWidth < 768 ? "Ikke understøttet på din enhed" : ""}</p>
  </div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Opgaver siden</span>

    <label class="label cursor-pointer">
      <span class="label-text">Vis absolut frist</span>
      <input type="checkbox" class="checkbox " bind:checked={$indstillinger.opgaver.visFristAbsolut} />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">Vis hele opgavenoten</span>
      <input type="checkbox" class="checkbox " bind:checked={$indstillinger.opgaver.visHeleBeskrivelsen} />
    </label>
  </div>
</div>

<div class="mt-4 rounded-lg bg-base-200 p-4">
  <div class="form-control">
    <span class="mb-2 text-lg font-bold">Skema siden</span>

    <label class="label cursor-pointer">
      <span class="label-text">Få forskellige farver på dine moduler</span>
      <input type="checkbox" class="checkbox " bind:checked={$indstillinger.skema.classesWithDiffrentColors} />
    </label>
  </div>
</div>

<h2 class="mt-4 font-mono opacity-20 transition-all duration-300 hover:opacity-100">
  BetterLectio version: {__APP_VERSION__}
</h2>
