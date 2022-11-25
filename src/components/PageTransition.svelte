<script>
  import { fly } from "svelte/transition";
  export let pathname = "";
</script>

{#key pathname}
  <div in:fly={{ y: -5, duration: 200, delay: 200 }} out:fly={{ y: 5, duration: 200 }}>
    <slot />
  </div>
{/key}
