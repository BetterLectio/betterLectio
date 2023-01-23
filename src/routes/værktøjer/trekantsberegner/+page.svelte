<script>
  let isCalculatible = false;

  let a;
  let b;
  let c;
  let A;
  let B;
  let C = 90;

  function checkAngles() { // this function checks if the angles are valid and returns true or false depending on the result
    if (A == undefined || B == undefined || C == undefined) {
      if (A != undefined || B != undefined || C != undefined) {
        return true;
      }
      return false;
    }

    if (A + B + C == 180) {
      return true;
    } else {
      return false;
    }
  }
  
  let areAngleValid = true;
  function checkData() {
    if (checkAngles()) {
      areAngleValid = true;
    } else {
      areAngleValid = false;
    }
    checkIfCorrectAmountOfDataIsFilled();
  }

  function checkIfCorrectAmountOfDataIsFilled() { // this function checks if at least 3 properties are filled out one of which must be a side
    let count = 0;
    let sideCount = 0;
    if (a != undefined) {count++; sideCount++;}
    if (b != undefined) {count++; sideCount++;}
    if (c != undefined) {count++; sideCount++;}
    if (A != undefined) {count++;}
    if (B != undefined) {count++;}
    if (C != undefined) {count++;}

    if (count >= 3 && sideCount >= 1) {
      isCalculatible = true;
    } else {
      isCalculatible = false;
    }
  }

  function calculate() {
  }
</script>

<h1 class="mb-3 text-3xl font-bold">Trekantsberegner</h1>

{#if !isCalculatible}
  <div class="alert alert-error shadow-lg mb-2">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Ikke nok data!</span>
    </div>
  </div>
{/if}
{#if !areAngleValid}
  <div class="alert alert-error shadow-lg mb-2">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Alle vinkler angivet men vinkelsum ikke 180°</span>
    </div>
  </div>
{/if}

<div class="flex w-full flex-row rounded-lg p-4">
  <div class="w-full">
    <p>Sider</p>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>a</span>
        <input
          type="number"
          placeholder="a"
          id="a"
          bind:value={a}
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>b</span>
        <input
          type="number"
          placeholder="b"
          id="b"
          bind:value={b}
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>c</span>
        <input
          type="number"
          placeholder="c"
          id="c"
          bind:value={c}
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
  </div>

  <div class="w-full">
    <p>Vinkler</p>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>A</span>
        <input
          type="number"
          placeholder="A"
          id="A"
          bind:value={A}
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>B</span>
        <input
          type="number"
          placeholder="B"
          id="B"
          bind:value={B}
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>C</span>
        <input
          type="number"
          placeholder="C"
          bind:value={C}
          disabled
          id="C"
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            checkData()
          }}
        />
      </label>
    </div>
  </div>
</div>

<button class="btn btn-primary mt-2" on:click={() => calculate()}>Beregn</button>
