<script lang="ts">
  import { homeworkStore } from '$lib/stores';
  import * as Card from '$lib/components/ui/card';
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import NewTabLink from '$lib/components/links/NewTabLink.svelte';
  import { constructInterval, relativeTime } from '$lib/utils';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { ArrowUpRight } from 'lucide-svelte';
  let loading = true;

  onMount(async () => {
    await homeworkStore.fetch();
    loading = false;
    console.log($homeworkStore);
  });
</script>

<div class="page-container">
  <h1>Lektier</h1>
  {#if loading}
    <p>Loading...</p>
  {:else if $homeworkStore}
    {#each $homeworkStore as homework}
      <Card.Root
        class={homework.aktivitet.status?.includes('aflyst')
          ? 'border-destructive dark:border-destructive'
          : ''}
      >
        <Card.Header>
          <Card.Title>
            <Badge class="mb-2">
              <span
                use:relativeTime={constructInterval(
                  homework.aktivitet.tidspunkt
                ).start?.toJSDate() || new Date()}
              />
            </Badge>
            <p>{homework.aktivitet.hold}</p>
          </Card.Title>
          <Card.Description>
            {homework.aktivitet.navn}
            &sdot; {homework.aktivitet.lokale}
            &sdot; {homework.aktivitet.lærer}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <SvelteMarkdown
            source={homework.lektier.replaceAll('\n', '<br>')}
            renderers={{ link: NewTabLink }}
          />
        </Card.Content>
        <Card.Footer>
          <Button size="sm" href={'/modul?absid=' + homework.aktivitet.absid}>
            Gå til modul <ArrowUpRight class="ml-4 size-4" />
          </Button>
        </Card.Footer>
      </Card.Root>
    {/each}
  {:else}
    <p>No homework</p>
  {/if}
</div>
