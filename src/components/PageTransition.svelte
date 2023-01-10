<script>
  import { fly } from "svelte/transition";
  import { quintOut, quintIn } from "svelte/easing";
  export let pathname = "";
</script>

{#key pathname}
  <div in:fly={{ y: -40, duration: 300, delay: 300, easing: quintOut }} out:fly={{ y: 40, duration: 300, easing: quintIn }}>
    <slot />
  </div>
{/key}
