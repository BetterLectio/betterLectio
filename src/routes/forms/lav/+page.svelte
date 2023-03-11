<script>
  let titel;

  $: spørgesmålArr = [];

  const addOverskrift = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "overskrift",
        overskrift: "",
        tekst: "",
      },
    ];
    console.log(spørgesmålArr);
  };

  const addEtSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "etSvar",
        overskrift: "",
        tekst: "",
        svarMuligheder: ["", "", "", ""],
      },
    ];
    console.log(spørgesmålArr);
  };

  const addFlereSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "flereSvar",
        overskrift: "",
        tekst: "",
        svarMuligheder: ["", "", "", ""],
      },
    ];
    console.log(spørgesmålArr);
  };

  const addÅbentSvar = () => {
    spørgesmålArr = [
      ...spørgesmålArr,
      {
        type: "åbentSvar",
        overskrift: "",
        tekst: "",
        svar: "",
      },
    ];
    console.log(spørgesmålArr);
  };

  const removeSpørgsmål = (i) => {
    spørgesmålArr = spørgesmålArr.filter((_, index) => index !== i);
    console.log(spørgesmålArr);
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

<!-- make spørgesmålArr elements go here-->
{#each spørgesmålArr as spørgsmål, i}
  {#if spørgsmål.type === "overskrift"}
    <section class="mb-4 h-fit w-full rounded-lg bg-base-200 p-4">
      <!-- prettier-ignore -->
      <div class="flex flex-row justify-end"><div class="btn btn-error btn-xs" on:click={() => {removeSpørgsmål(i);}}>Fjern</div></div>

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
    </section>
  {/if}
{/each}

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
