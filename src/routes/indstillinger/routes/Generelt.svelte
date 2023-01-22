<script>
  import { instillinger } from "../../../components/store";

  let windowWidth = window.innerWidth;

  function handleResize() {
    windowWidth = window.innerWidth;
  }

  window.addEventListener("resize", handleResize);
</script>

<h1 class="mb-4 text-3xl font-bold">Indstillinger - Generelt</h1>

<div class="p-4 bg-base-200 rounded-lg">
  <div class="form-control">
    <span class="font-bold text-lg mb-2">Layout</span>
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

<div class="p-4 bg-base-200 rounded-lg mt-4">
  <div class="form-control">
    <span class="font-bold text-lg mb-2">Opgaver siden</span>
    <label class="label cursor-pointer">
      <span class="label-text">Vis absolut frist</span> 
      {#if windowWidth > 768}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.opgaver.erFristAbsolut}/>
      {:else}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.opgaver.erFristAbsolut} disabled/>
      {/if}
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">Vis hele opgavenoten</span> 
      {#if windowWidth > 768}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.opgaver.visHeleBeskrivelsen}/>
      {:else}
      <input type="checkbox" class="checkbox " bind:checked={$instillinger.opgaver.visHeleBeskrivelsen} disabled/>
      {/if}
    </label>
  </div>
</div>