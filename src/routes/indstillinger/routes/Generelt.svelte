<script>
  import { instillinger } from "../../../components/store";

  if (!$instillinger)
    $instillinger = {
      sidebar: false,
      opgaver: {
        visFristAbsolut: false,
        visHeleBeskrivelsen: false,
      },
    };

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
        bind:checked={$instillinger.sidebar}
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
      <input
        type="checkbox"
        class="checkbox "
        bind:checked={$instillinger.opgaver.visFristAbsolut}
        disabled={windowWidth > 768 ? "" : "disabled"}
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">Vis hele opgavenoten</span>
      <input
        type="checkbox"
        class="checkbox "
        bind:checked={$instillinger.opgaver.visHeleBeskrivelsen}
        disabled={windowWidth > 768 ? "" : "disabled"}
      />
    </label>
  </div>
</div>

<h2 class="font-mono mt-4 opacity-20 hover:opacity-100 transition-all duration-300" >BetterLectio version: {__APP_VERSION__}</h2>
