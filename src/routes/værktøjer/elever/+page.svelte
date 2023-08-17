<script>
  import BrugerPopup from "$lib/components/BrugerPopup.svelte";
  import { get } from "$lib/js/http";

  const showAllClasses = "Alle Klasser";
  const allStudents = [];
  let classes = new Set();
  let studentsIndexed = [];
  let studentsInClass = [];
  let usersLoaded = false;
  let searchString = "";
  let selectedClass = showAllClasses;

  function parseStudentInfo(navnOgKlasse, userId) {
    const lastParentheses = navnOgKlasse.lastIndexOf("(") || 0;
    let [navn, klasse] = [navnOgKlasse.substr(0, lastParentheses) || navnOgKlasse, navnOgKlasse.substr(lastParentheses)];
    if (!klasse) {
      return {
        navn,
        userId,
        elevIndeks: "",
      };
    }

    const lastSpace = klasse.lastIndexOf(" ");
    let elevIndeks = klasse.slice(lastSpace, -1);

    if (isNaN(parseInt(elevIndeks))) {
      elevIndeks = "";
      klasse = klasse.slice(1, -1);
    } else {
      elevIndeks = ` ${elevIndeks}`;
      klasse = klasse.slice(1, lastSpace);
    }

    return {
      navn,
      userId,
      klasse,
      elevIndeks,
    };
  }

  get("/informationer").then(($informationer) => {
    for (const [navn, userId] of Object.entries($informationer.elever)) {
      allStudents.push(parseStudentInfo(navn, userId));
    }

    for (const klasse in $informationer.klasser) classes.add(klasse);
    classes = [...classes].sort((a, b) => a.localeCompare(b));

    studentsIndexed = studentsInClass = allStudents;
    usersLoaded = true;
  });

  function sortByClass() {
    if (selectedClass === showAllClasses) studentsInClass = allStudents;
    else studentsInClass = allStudents.filter((student) => student.klasse === selectedClass);

    search();
  }
  function search() {
    studentsIndexed = studentsInClass.filter(({ navn }) => navn.toLowerCase().includes(searchString.toLowerCase()));
  }
</script>

<h1 class="heading">Elevliste</h1>

<input
  type="text"
  placeholder="Søg i elevliste"
  class="input-bordered input mb-4 w-full md:w-1/4"
  bind:value={searchString}
  on:input={search}
/>
<select class="select select-bordered w-full max-w-xs" bind:value={selectedClass} on:change={sortByClass}>
  <option value={showAllClasses}>{usersLoaded ? showAllClasses : "Indlæser ..."}</option>
  {#if usersLoaded}
    {#each [...classes] as option}
      <option value={option}>{option}</option>
    {/each}
  {/if}
</select>
<div class="">
  <table class="table-zebra table-compact table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th />
        <th>Navn</th>
        <th>Klasse</th>
      </tr>
    </thead>
    <tbody>
      {#if usersLoaded}
        {#each studentsIndexed as elev, index}
          <tr>
            <th>{index + 1}</th>
            <td><BrugerPopup navn={elev.navn} id={elev.userId}>{elev.navn}</BrugerPopup></td>
            <td>{elev.klasse}{elev.elevIndeks}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
