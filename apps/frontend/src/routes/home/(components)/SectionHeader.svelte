<script lang="ts">
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import { Spinner } from '$lib/components/index.js';

  export let label: string;
  export let link: string;
  export let loading = false;
</script>

<div class="flex items-center justify-between">
  <a href={link} class="flex items-center gap-1 unstyled">
    <span class="text-lg font-medium unstyled">{label}</span>
    <ArrowUpRight class="size-4" />
  </a>
  {#if loading}
    <Spinner />
  {/if}
</div>