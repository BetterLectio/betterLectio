<script lang="ts">
  import LectioAvatarPopup from '$lib/components/lectio/LectioAvatarPopup.svelte';
  import * as Card from '$lib/components/ui/card';
  import type { Student } from '$lib/types/information';
  import IntersectionObserver from 'svelte-intersection-observer';

  export let student: Student;
  let node: HTMLElement;
</script>

<IntersectionObserver once element={node} let:intersecting>
  <div bind:this={node}>
    {#if intersecting}
      <Card.Root>
        <!-- <Card.Header>
        <Card.Title>$info</Card.Title>
        <Card.Description>Card Description</Card.Description>
        </Card.Header> -->
        <Card.Content class="p-2">
          <LectioAvatarPopup id={student.id} navn={student.name}>
            <span class="w-fit">{student.name}</span>
          </LectioAvatarPopup>
        </Card.Content>
        <!-- <Card.Footer>
            <p>Card Footer</p>
          </Card.Footer> -->
      </Card.Root>
    {/if}
  </div>
</IntersectionObserver>
