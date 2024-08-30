<script lang="ts">
import StudentElement from "./StudentElement.svelte";

import * as Card from "$lib/components/ui/card";
import { Input } from "$lib/components/ui/input";
import { informationStore } from "$lib/stores";
import type { Information, Student } from "$lib/types/information";
import IntersectionObserver from "svelte-intersection-observer";
import { get } from "$lib/utils";
import { onMount } from "svelte";
import fuzzy from "fuzzy";

get("/informationer").then((data) => {
	console.log(data);
});

let searchString = "";
let filteredStudents: Student[];

onMount(() => {
	informationStore.fetch();
	console.log($informationStore);
});

$: {
	if ($informationStore) {
		filteredStudents = fuzzy
			.filter(searchString, $informationStore.students, {
				extract: (student) => student.name,
			})
			.map((result) => result.original)
			.filter(
				(student) =>
					student.name !== "<Navnebeskyttet> <Navnebeskyttet>" &&
					!student.klasse.includes("inaktiv"),
			);
	}
}
</script>

<div class="page-container">
  <h1>Elever</h1>

  <div>
    <Input placeholder="Søg efter lokaler (f.eks. teori)" bind:value={searchString} />
  </div>

  <div class="flex flex-col gap-2">
    {#if !$informationStore}
      <p>loading...</p>
    {:else}
      {#each filteredStudents as student}
      <StudentElement student={student}></StudentElement>
      {/each}
    {/if}
  </div>
</div>