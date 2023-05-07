<script>
  import { blur } from "svelte/transition";
  import { notifications } from "$lib/js/notifyStore.js";
</script>

<div class="toast-start toast-bottom toast z-10 inline h-fit lg:ml-20">
  {#each $notifications as toast}
    <div class="alert mb-4 h-fit shadow-2xl {toast.bgColor}" out:blur>
      <div class="h-fit">
        <span class="h-fit w-56">
          {toast.message}
        </span>
      </div>
    </div>
  {/each}
</div>
