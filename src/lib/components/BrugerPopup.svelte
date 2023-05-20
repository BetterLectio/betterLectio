<script>
  export let navn;
  export let id;

  let BrugerPopupWindow;
</script>

<div class="dropdown">
  <button
    on:click={async () => {
      if (!BrugerPopupWindow) {
        BrugerPopupWindow = (await import("./BrugerPopupWindow.svelte")).default;
      }
    }}
    tabindex="0"
    class="hover:underline"
  >
    <slot />
  </button>

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div tabindex="0" class="dropdown-content rounded-box bg-base-100 p-2 shadow">
    {#if BrugerPopupWindow}
      <svelte:component this={BrugerPopupWindow} {navn} {id} />
    {:else}
      <div class="text-center">Henter brugerdata...</div>
    {/if}
  </div>
</div>
