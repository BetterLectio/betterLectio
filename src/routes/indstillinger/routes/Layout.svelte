<script>
  import { instillinger } from "../../../components/store";

  let windowWidth = window.innerWidth;

  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);
</script>

<h1 class="mb-4 text-3xl font-bold">Indstillinger - Layout</h1>

<div class="p-4 bg-base-200 rounded-lg">
  <div class="form-control">
    <p>Skift imellem sidebar og topbar layout på store skærme</p>
    <label class="label cursor-pointer">
      <span class="label-text">Sidebar</span> 
      {#if windowWidth > 768}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.sidebar}/>
      {:else}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.sidebar} disabled/>
      {/if}
    </label>
    <p class="text-error ">{windowWidth < 768 ? "Ikke understøttet på din enhed" : ""}</p>
  </div>
</div>