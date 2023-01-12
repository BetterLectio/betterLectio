<script>
  export let navn;
  export let id;

  let BrugerDropdown;
</script>

<div class="dropdown">
  <button
    on:click={async () => {
      if (!BrugerDropdown) {
        console.log("Loading BrugerPopup");
        BrugerDropdown = (await import("./BrugerPopupWindow.svelte")).default;
      }
    }}
    tabindex="0"
  >
    <slot />
  </button>

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div tabindex="0" class="dropdown-content rounded-box bg-base-100 p-2 shadow">
    {#if BrugerDropdown}
      <svelte:component this={BrugerDropdown} {navn} {id} />
    {:else}
      <div class="text-center">Henter brugerdata...</div>
    {/if}
  </div>
</div>
