<script>
  import { blur } from "svelte/transition";
  import { notifications } from "./notifyStore.js";
</script>

<div class="toast toast-bottom toast-start z-10 inline h-fit">
  {#each $notifications as toast}
  <div class="alert h-fit shadow-2xl mb-4 {toast.bgColor}" out:blur>
    <div class="h-fit">
      <span class="h-fit w-56">
        {toast.message}
      </span>
    </div>
  </div>
  {/each}
</div>

