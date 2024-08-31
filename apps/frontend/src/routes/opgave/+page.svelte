<script lang="ts">
  import AssignmentUploader from './AssignmentUploader.svelte';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Spinner } from '$lib/components';
  import AssignmentAttachmentDownloader from '$lib/components/lectio/AssignmentAttachmentDownloader.svelte';
  import Avatar from '$lib/components/lectio/Avatar.svelte';
  import { NewTabLink } from '$lib/components/links';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import type { RawAssignment } from '$lib/types/assignments';
  import { get } from '$lib/utils/http';
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';

  const exerciseid = $page.url.searchParams.get('id');
  if (!exerciseid) goto('/opgaver');

  let assignment: RawAssignment;
  let ready = false;

  onMount(async () => {
    const res = await get(`/opgave?exerciseid=${exerciseid}`);
    if (!res) goto('/opgaver');

    console.log(res);
    assignment = res;
    ready = true;
  });

  function parseLink(link: string) {
    if (link === '') return { link: '', text: '' };
    return { link: link.split('](')[1].split(')')[0], text: link.split('](')[0].split('[')[1] };
  }
</script>

<div class="page-container">
  {#if ready}
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <Badge class="text-xl" variant="outline">{assignment.oplysninger.hold}</Badge>
        <h1 class="text-2xl md:text-3xl">
          {assignment.oplysninger.opgavetitel}
        </h1>
      </div>
      <div>
        {#if assignment.afleveres_af.afventer === 'Elev'}
          <Badge>afventer: {assignment.afleveres_af.afventer}</Badge>
        {/if}
        {#if assignment.afleveres_af.afsluttet === true}
          <Badge variant="secondary">afsluttet</Badge>
        {/if}
        {#if assignment.afleveres_af.status_fravær.includes('Fravær: 100%')}
          <Badge variant="destructive">{assignment.afleveres_af.status_fravær}</Badge>
        {/if}
        <Badge variant="outline">skala: {assignment.oplysninger.karakterskala}</Badge>
        <Badge variant="outline">frist: {assignment.oplysninger.afleveringsfrist}</Badge>
        <Badge variant="outline">elevtid: {assignment.oplysninger.elevtid}</Badge>
      </div>
      <div class="space-y-4">
        {#if assignment.oplysninger.opgavenote}
          <div>
            <SvelteMarkdown
              source={assignment.oplysninger.opgavenote.replaceAll('\n', '\n\n')}
              renderers={{ link: NewTabLink }}
            />
          </div>
        {:else}
          <p>Opgaven har ikke nogen beskrivelse.</p>
        {/if}
        {#if assignment.oplysninger.opgavebeskrivelse}
          <div>
            <SvelteMarkdown
              source={assignment.oplysninger.opgavebeskrivelse.replaceAll('\n', '\n\n')}
              renderers={{ link: NewTabLink }}
            />
          </div>
        {/if}
      </div>
      {#if assignment.gruppemedlemmer.length > 1}
        <Separator />
        <h2 class="!mt-2 text-xl md:text-2xl">Gruppemedlemmer</h2>
        <div class="flex flex-wrap gap-2 pt-3">
          {#each assignment.gruppemedlemmer as bruger}
            <Avatar id={bruger.bruger_id} />
          {/each}
        </div>
      {/if}

      <Separator class="my-6" />
      <div class="!mt-0">
        <!-- inlæg og afleverings knap -->
        {#if assignment.opgave_indlæg.length !== 0}
          <!-- content here -->
          <h3 class="text-lg !mt-2">Opgave indlæg</h3>
          <div class="flex flex-col gap-2">
            {#each assignment.opgave_indlæg as indlæg}
              <Card.Root class="*:p-2">
                <Card.Header>
                  <Card.Title>
                    <div class="flex gap-2">
                      <div>
                        <Avatar id={indlæg.bruger.bruger_id} />
                      </div>
                      <div class="flex flex-col justify-between">
                        <p>{indlæg.bruger.navn}</p>
                        <p class="text-sm text-muted-foreground">
                          {indlæg.tidspunkt}
                        </p>
                      </div>
                    </div>
                  </Card.Title>
                </Card.Header>
                {#if indlæg.indlæg}
                  <Card.Content>
                    <p>{indlæg.indlæg}</p>
                  </Card.Content>
                {/if}
                <Card.Footer>
                  {#if indlæg.dokument}
                    {@const { link, text } = parseLink(indlæg.dokument)}
                    <AssignmentAttachmentDownloader {link} {text} />
                  {/if}
                </Card.Footer>
              </Card.Root>
            {/each}
          </div>
        {/if}
        {#if assignment.afleveres_af.afventer === 'Elev'}
          {#if assignment.opgave_indlæg.length !== 0}
            <Separator class="my-6" />
          {/if}
          <AssignmentUploader {assignment} {exerciseid} />
        {/if}
        {#if assignment.afleveres_af.elevnote || assignment.afleveres_af.karakter || assignment.afleveres_af.karakternote}
          {#if assignment.opgave_indlæg.length !== 0}
            <Separator class="my-6" />
          {/if}
          <h3 class="text-lg !mt-2">Tilbagemelding</h3>
          <Card.Root class="*:p-2">
            <Card.Header>
              <Card.Title>
                <div class="flex gap-2">
                  <div>
                    <Avatar id={assignment.oplysninger.ansvarlig.bruger_id} />
                  </div>
                  <div class="flex flex-col justify-between">
                    <p>{assignment.oplysninger.ansvarlig.navn}</p>
                    <p class="text-sm text-muted-foreground">
                      {assignment.oplysninger.karakterskala}
                    </p>
                  </div>
                </div>
              </Card.Title>
            </Card.Header>
            {#if assignment.afleveres_af.elevnote}
              <Card.Content>
                <p>{assignment.afleveres_af.elevnote}</p>
              </Card.Content>
            {/if}
            <Card.Footer>
              {#if assignment.afleveres_af.karakter}
                <span>Karakter:</span>
                <Badge variant="outline" class="ml-2 ">{assignment.afleveres_af.karakter}</Badge>
              {/if}
              {#if assignment.afleveres_af.karakternote}
                <p>{assignment.afleveres_af.karakternote}</p>
              {/if}
            </Card.Footer>
          </Card.Root>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex space-x-2">
      <h1>Indlæser opgave...</h1>
      <Spinner />
    </div>
  {/if}
</div>
