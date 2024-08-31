<script lang="ts">
  import { Avatar } from '$lib/components/lectio';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Command from '$lib/components/ui/command';
  import * as Popover from '$lib/components/ui/popover';
  import { authStore } from '$lib/stores';
  import type { RawAssignment } from '$lib/types/assignments';
  import { get } from '$lib/utils';
  import { uploadOpgave } from '$lib/utils/http';
  import { ChevronsUpDown } from 'lucide-svelte';
  import { tick } from 'svelte';

  export let exerciseid: string | null;
  export let assignment: RawAssignment;

  let ready = false;
  let open = false;

  let value = '';

  $: selectedValue =
    assignment.mulige_gruppemedlemmer.find((f) => f.navn === value)?.navn || 'Tilføj gruppemedlem';

  async function closeAndAddMember(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });

    //find added person
    const person = assignment.mulige_gruppemedlemmer.find((f) => f.navn === value);
    if (!person) return;

    type returnVal = { success: boolean; error: string | undefined };

    let res: returnVal = await get('/tilfoej_gruppemedlem', {
      exerciseid: exerciseid,
      bruger_id: person.bruger_id
    });
    if (!res.success) {
      alert('Kunne ikke tilføje gruppemedlem: ' + res.error);
    } else {
      //reload page
      window.location.reload();
    }
  }

  async function removeMember(bruger_id: string) {
    type returnVal = { success: boolean; error: string | undefined };

    console.log(bruger_id);

    let res: returnVal = await get('/fjern_gruppemedlem', {
      exerciseid: exerciseid,
      bruger_id: bruger_id
    });
    if (!res.success) {
      alert('Kunne ikke fjerne gruppemedlem: ' + res.error);
    } else {
      //reload page
      window.location.reload();
    }
  }

  async function formUploadAssignment(event: SubmitEvent) {
    type returnVal = { success: boolean; error: string | undefined };

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!exerciseid) {
      alert('Intet opgave id');
      return;
    }

    const res: returnVal = await uploadOpgave(formData, exerciseid);
    if (!res.success) {
      alert('Kunne ikke aflevere opgave: ' + res.error);
    } else {
      //reload page
      window.location.reload();
    }
  }
</script>

<Card.Root class="">
  <Card.Header>
    {#if assignment.opgave_indlæg.length !== 0}
      <Card.Title class="">Genaflever opgave</Card.Title>
    {:else}
      <Card.Title class="">Aflever opgave</Card.Title>
    {/if}
  </Card.Header>
  <Card.Content class="flex flex-col-reverse gap-2 md:flex-row">
    <div class="flex flex-col w-full gap-2">
      <form
        enctype="multipart/form-data"
        on:submit|preventDefault={formUploadAssignment}
        class="flex flex-col gap-2"
      >
        <input
          class="flex w-full px-3 py-1 text-sm transition-colors border rounded-md shadow-sm h-9 border-input bg-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="note"
          type="text"
          placeholder="Note"
        />
        <input
          class="flex w-full px-3 py-1 text-sm transition-colors border rounded-md shadow-sm h-9 border-input bg-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="opgave"
          type="file"
        />
        <Button class="w-full" type="submit">Aflever</Button>
      </form>
      <Button
        href={`https://www.lectio.dk/lectio/${
          $authStore.school
        }/ElevAflevering.aspx?elevid=${assignment.afleveres_af.elev.bruger_id.slice(
          1
        )}&exerciseid=${exerciseid}`}
        target="_blank"
        variant="ghost"
        class="w-full"
        >Aflever på Lectio
      </Button>
    </div>
    <div class="w-full">
      <p>Gruppemedlemmer:</p>
      <div class="flex flex-col gap-2 my-2">
        {#each assignment.gruppemedlemmer as member}
          <div class="flex justify-between w-full gap-2">
            <Avatar id={member.bruger_id} navn={member.navn} />
            <div class="flex justify-between w-full gap-2">
              <p class="overflow-hidden leading-[3] line-clamp-1">{member.navn}</p>
              {#if assignment.afleveres_af.elev.bruger_id !== member.bruger_id}
                <Button
                  size="sm"
                  variant="destructive"
                  on:click={() => {
                    removeMember(member.bruger_id);
                  }}>Fjern</Button
                >
              {/if}
            </div>
          </div>
        {/each}
      </div>
      <div>
        <Popover.Root bind:open let:ids>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              class="justify-between w-full"
            >
              {selectedValue}
              <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="p-0">
            <Command.Root>
              <Command.Input placeholder="Søg efter gruppemedlem" />
              <Command.Empty>Ingen mulige gruppemedlemmer</Command.Empty>
              <Command.Group class="overflow-y-scroll h-60">
                {#each assignment.mulige_gruppemedlemmer as person}
                  <Command.Item
                    value={person.navn}
                    onSelect={(currentValue) => {
                      value = currentValue;
                      closeAndAddMember(ids.trigger);
                    }}
                  >
                    {person.navn}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  </Card.Content>
</Card.Root>
