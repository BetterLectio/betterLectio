<script>
  import { fly } from "svelte/transition";

  let titel;

  $: spørgesmålArr = [];

  const addOverskrift = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "Overskrift",
        overskrift: "",
        tekst: "",
      },
    ];
  };

  const addEtSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "Ét svar",
        overskrift: "",
        tekst: "",
        svarMuligheder: ["", "", "", ""],
      },
    ];
  };

  const addFlereSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "Flere svar",
        overskrift: "",
        tekst: "",
        svarMuligheder: ["", "", "", ""],
      },
    ];
  };

  const addÅbentSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "Åbent svar",
        overskrift: "",
        tekst: "",
      },
    ];
  };

  const removeSpørgsmål = (i) => {
    spørgesmålArr = spørgesmålArr.filter((_, index) => index !== i);
  };

  const addSvarmulighed = (i) => {
    spørgesmålArr[i].svarMuligheder = [...spørgesmålArr[i].svarMuligheder, ""];
  };

  const removeSvarmulighed = (i, j) => {
    spørgesmålArr[i].svarMuligheder = spørgesmålArr[i].svarMuligheder.filter((_, index) => index !== j);
  };

  const moveElement = (i, direction) => {
    const temp = spørgesmålArr[i];
    spørgesmålArr[i] = spørgesmålArr[i + direction];
    spørgesmålArr[i + direction] = temp;
  };

  const moveSvarmulighed = (i, j, direction) => {
    const temp = spørgesmålArr[i].svarMuligheder[j];
    spørgesmålArr[i].svarMuligheder[j] = spørgesmålArr[i].svarMuligheder[j + direction];
    spørgesmålArr[i].svarMuligheder[j + direction] = temp;
  };
</script>

<h1 class="mb-4 text-3xl font-bold">{titel == "" || titel == undefined ? "Nyt spørgeskema" : titel}</h1>

<section class="h-fit w-full rounded-lg bg-base-200 p-4">
  <div class="form-control w-full">
    <label class="label" for="titel">
      <span class="label-text">Titel:</span>
    </label>
    <!-- prettier-ignore -->
    <input type="text" placeholder="Nyt spørgeskema" bind:value={titel} id="titel" class="mb-6 input-bordered input w-full max-w-xs transition-all duration-300 {titel == "" || titel == undefined ? "input-error" : ""}"/>

    <div class="flex flex-col md:flex-row">
      <div class="w-full max-w-xs">
        <label class="label" for="Startdato">
          <span class="label-text">Åben for besvarelse: - Fra</span>
        </label>
        <!-- prettier-ignore -->
        <input type="date" placeholder="Start dato" id="Startdato" class="input-bordered input w-full max-w-xs transition-all duration-300 "/>
      </div>
      <div class="mb-6 w-full max-w-xs md:ml-4">
        <label class="label" for="Slutdato">
          <span class="label-text">Åben for besvarelse: - Til</span>
        </label>
        <!-- prettier-ignore -->
        <input type="date" placeholder="Slut dato" id="Slutdato" class="input-bordered input w-full max-w-xs transition-all duration-300 "/>
      </div>
    </div>

    <div class="flex flex-col md:flex-row">
      <div class="w-full max-w-xs">
        <label class="label" for="Startdatorapportering">
          <span class="label-text">Åben for rapportering: - Fra</span>
        </label>
        <!-- prettier-ignore -->
        <input type="date" placeholder="Start dato rapportering" id="Startdatorapportering" class="input-bordered input w-full max-w-xs transition-all duration-300 "/>
      </div>
      <div class="mb-6 w-full max-w-xs md:ml-4">
        <label class="label" for="Slutdatorapportering">
          <span class="label-text">Åben for rapportering: - Til</span>
        </label>
        <!-- prettier-ignore -->
        <input type="date" placeholder="Slut dato rapportering" id="Slutdatorapportering" class="input-bordered input w-full max-w-xs transition-all duration-300 "/>
      </div>
    </div>

    <label class="label mb-3 max-w-xs cursor-pointer">
      <span class="label-text">Anonymt:</span>
      <input type="checkbox" checked="checked" class="checkbox" />
    </label>

    <label class="label mb-3 max-w-xs cursor-pointer">
      <span class="label-text">Lærer:</span>
      <button class="btn btn-sm">Tilføj/fjern</button>
    </label>

    <label class="label mb-6 max-w-xs cursor-pointer">
      <span class="label-text">Hold / Grupper:</span>
      <button class="btn btn-sm">Tilføj/fjern</button>
    </label>
  </div>
</section>

<div class="divider" />
{#if spørgesmålArr.length != 0}
  {#each spørgesmålArr as spørgsmål, i}
    <!-- prettier-ignore -->
    <section class="mb-4 h-fit w-full rounded-lg bg-base-200 p-4" out:fly={{ duration: 200, y: -20 }} in:fly={{ duration: 200, y: -20, delay: 200 }}>
      <div class="flex flex-row justify-between">
        <p class="text-xl font-bold">{spørgesmålArr[i].type}</p>
        <div class="btn-group">
          {#if spørgesmålArr.length > 1}
            {#if i != 0}
              <!-- prettier-ignore -->
              <div class=" btn-sm btn" on:click={() => {moveElement(i, -1);}} out:fly={{ duration: 200, x: 5 }} in:fly={{ duration: 200, x: 5, delay: 200 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg></div>
            {/if}
            {#if i != spørgesmålArr.length - 1}
              <!-- prettier-ignore -->
              <div class=" btn-sm btn" on:click={() => {moveElement(i, 1);}} out:fly={{ duration: 200, x: 5 }} in:fly={{ duration: 200, x: 5, delay: 200 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg></div>
            {/if}
          {/if}
          <!-- prettier-ignore -->
          <div class="btn-error btn-sm btn" on:click={() => {removeSpørgsmål(i);}} out:fly={{ duration: 200, x: 5 }} in:fly={{ duration: 200, x: 5, delay: 200 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg></div>
        </div>
      </div>

      <label class="label" for="overskrift">
        <span class="label-text">Overskrift:</span>
      </label>
      <!-- prettier-ignore -->
      <input type="text" placeholder="Overskrift" bind:value={spørgesmålArr[i].overskrift} id="overskrift" class="mb-6 input-bordered input w-full max-w-md transition-all duration-300"/>

      <label class="label" for="tekst">
        <span class="label-text">Tekst:</span>
      </label>
      <!-- prettier-ignore -->
      <input type="text" placeholder="tekst" bind:value={spørgesmålArr[i].tekst} id="tekst" class="mb-6 input-bordered input w-full transition-all duration-300"/>
      {#if spørgsmål.type === "Overskrift" || spørgsmål.type === "Åbent svar"}
        <!-- ikke noget her-->
      {:else if spørgsmål.type === "Ét svar" || spørgsmål.type === "Flere svar"}
        <label class="label" for="svarmuligheder">
          <span class="label-text">Svarmuligheder:</span>
        </label>
        <div class="flex flex-col">
          {#each spørgsmål.svarMuligheder as s, j}
            <label class="input-group">
              <!-- prettier-ignore -->
              <input type="text" placeholder="Svarmulighed" id="svarmulighed" bind:value={spørgesmålArr[i].svarMuligheder[j]} class="mb-2 input-bordered input input-sm w-full max-w-xs transition-all duration-300" out:fly={{ duration: 200, y: -5, delay: 200}} in:fly={{ duration: 200, y: -5, delay: 200 }}/>
              <!-- prettier-ignore -->
              <span class="btn btn-error btn-sm w-fit" on:click={() => {removeSvarmulighed(i, j);}} out:fly={{ duration: 200, x: -5 }} in:fly={{ duration: 200, x: -5, delay: 400 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg></span>
              {#if spørgesmålArr[i].svarMuligheder.length > 1}
                {#if j != 0}
                  <!-- prettier-ignore -->
                  <span class="btn btn-sm w-fit" on:click={() => {moveSvarmulighed(i, j, -1);}} out:fly={{ duration: 200, x: -5 }} in:fly={{ duration: 200, x: -5, delay: 600 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg></span>
                {/if}
                {#if j != spørgesmålArr[i].svarMuligheder.length - 1}
                  <!-- prettier-ignore -->
                  <span class="btn btn-sm w-fit" on:click={() => {moveSvarmulighed(i, j, 1);}} out:fly={{ duration: 200, x: -5 }} in:fly={{ duration: 200, x: -5, delay: 800 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg></span>
                {/if}
              {/if}
            </label>
          {/each}
        </div>
        <!-- prettier-ignore -->
        <div class="btn btn-sm" on:click={() => {addSvarmulighed(i);}}>Tilføj svarmulighed</div>
        {/if}
      </section>
  {/each}
{:else}
  <!-- prettier-ignore -->
  <section class="mb-4 h-fit w-full rounded-lg bg-base-200 p-4" out:fly={{ duration: 200, y: -20 }} in:fly={{ duration: 200, y: -20, delay: 200 }}>
    <p class="text-xl font-bold">Ingen spørgsmål</p>
  </section>
{/if}

<div class="divider" />

<section class="h-fit w-full rounded-lg bg-base-200 p-4">
  <label class="label max-w-xs cursor-pointer">
    <span class="label-text">Indsæt element:</span>
  </label>
  <div class="btn mt-1 w-full md:w-32" on:click={addOverskrift}>Overskrift</div>
  <div class="btn mt-1 w-full md:w-32" on:click={addEtSvar}>Ét svar</div>
  <div class="btn mt-1 w-full md:w-32" on:click={addFlereSvar}>Flere svar</div>
  <div class="btn mt-1 w-full md:w-32" on:click={addÅbentSvar}>Åbent svar</div>
</section>
