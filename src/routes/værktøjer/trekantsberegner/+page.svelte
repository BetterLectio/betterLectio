<script>
  let isCalculatible = false;

  let a;
  let b;
  let c;
  let A;
  let B;
  let C = 90;

  function reset() {
    // this function resets all the values
    a = undefined;
    b = undefined;
    c = undefined;
    A = undefined;
    B = undefined;
    C = 90;
  }

  // if any of the values change, the function checkData() is called
  $: if (
    a != undefined ||
    b != undefined ||
    c != undefined ||
    A != undefined ||
    B != undefined ||
    C != undefined ||
    a != null ||
    b != null ||
    c != null ||
    A != null ||
    B != null ||
    C != null
  ) {
    checkData();
  }

  function checkAngles() {
    // this function checks if the angles are valid and returns true or false depending on the result
    if (A == undefined || B == undefined || C == undefined || A == null || B == null || C == null) {
      if (A != undefined || B != undefined || C != undefined || A != null || B != null || C != null) {
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

  function checkIfCorrectAmountOfDataIsFilled() {
    // this function checks if at least 3 properties are filled out one of which must be a side
    let count = 0;
    let sideCount = 0;
    if (a != undefined || a != null) {
      count++;
      sideCount++;
    }
    if (b != undefined || b != null) {
      count++;
      sideCount++;
    }
    if (c != undefined || c != null) {
      count++;
      sideCount++;
    }
    if (A != undefined || A != null) {
      count++;
    }
    if (B != undefined || B != null) {
      count++;
    }
    if (C != undefined || C != null) {
      count++;
    }

    if (count >= 3 && sideCount >= 1) {
      return true;
    } else {
      return false;
    }
  }

  function checkSides() {
    // using pythagoras' theorem, this function checks if the sides are valid and returns true or false depending on the result
    if (a == undefined || b == undefined || c == undefined || a == null || b == null || c == null) {
      return true;
    }

    if (Math.pow(a, 2) + Math.pow(b, 2) == Math.pow(c, 2)) {
      return true;
    } else {
      return false;
    }
  }

  let areSidesValid = true;
  let areAnglesValid = true;
  let isCorrectAmountOfDataIsFilled = false;
  function checkData() {
    if (checkAngles()) {
      areAnglesValid = true;
    } else {
      areAnglesValid = false;
    }
    if (checkIfCorrectAmountOfDataIsFilled()) {
      isCorrectAmountOfDataIsFilled = true;
    } else {
      isCorrectAmountOfDataIsFilled = false;
    }

    if (checkSides()) {
      areSidesValid = true;
    } else {
      areSidesValid = false;
    }

    if (areAnglesValid && isCorrectAmountOfDataIsFilled && areSidesValid) {
      isCalculatible = true;
    } else {
      isCalculatible = false;
    }
  }

  function calculate() {
    if (!isCalculatible) {
      return;
    }
    let hash = "";
    if (a == undefined || a == null ? false : true) {
      hash += "a";
    }
    if (b == undefined || b == null ? false : true) {
      hash += "b";
    }
    if (c == undefined || c == null ? false : true) {
      hash += "c";
    }
    if (A == undefined || A == null ? false : true) {
      hash += "A";
    }
    if (B == undefined || B == null ? false : true) {
      hash += "B";
    }
    if (C == undefined || C == null ? false : true) {
      hash += "C";
    }
    console.log(hash); // the hash is used to determine which values are determined and which are not and which values are needed to calculate the missing values

    switch (hash) {
      case "aAC":
        c = a / Math.sin((A * Math.PI) / 180);
        b = a / Math.tan((A * Math.PI) / 180);
        B = 180 - A - C;
        break;
      case "aBC":
        A = 180 - B - C;
        c = a / Math.sin((A * Math.PI) / 180);
        b = a / Math.tan((A * Math.PI) / 180);
        break;
      case "aABC":
        c = a / Math.sin((A * Math.PI) / 180);
        b = a / Math.tan((A * Math.PI) / 180);
        break;
      case "bAC":
        a = b * Math.tan((A * Math.PI) / 180);
        c = b / Math.cos((A * Math.PI) / 180);
        B = 180 - A - C;
        break;
      case "bBC":
        A = 180 - B - C;
        a = b * Math.tan((A * Math.PI) / 180);
        c = b / Math.cos((A * Math.PI) / 180);
        break;
      case "bABC":
        a = b * Math.tan((A * Math.PI) / 180);
        c = b / Math.cos((A * Math.PI) / 180);
        break;
      case "cAC":
        a = c * Math.sin((A * Math.PI) / 180);
        b = c * Math.cos((A * Math.PI) / 180);
        B = 180 - A - C;
        break;
      case "cBC":
        A = 180 - B - C;
        a = c * Math.sin((A * Math.PI) / 180);
        b = c * Math.cos((A * Math.PI) / 180);
        break;
      case "cABC":
        a = c * Math.sin((A * Math.PI) / 180);
        b = c * Math.cos((A * Math.PI) / 180);
        break;
      case "abC":
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "acC":
        b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "bcC":
        a = Math.sqrt(Math.pow(c, 2) - Math.pow(b, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "abcC":
        A = (Math.asin(a / c) * 180) / Math.PI;
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "abcAC":
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "abcBC":
        A = (Math.asin(a / c) * 180) / Math.PI;
        break;
      case "abcABC":
        break;
      case "abAC":
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "abBC":
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        break;
      case "abABC":
        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        break;
      case "acAC":
        b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "acBC":
        b = Math.sqrt(Math.pow(c, 2) - Math.pow(a, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        break;
      case "acABC":
        b = math.sqrt(math.pow(c, 2) - math.pow(a, 2));
        break;
      case "bcAC":
        a = Math.sqrt(Math.pow(c, 2) - Math.pow(b, 2));
        B = (Math.asin(b / c) * 180) / Math.PI;
        break;
      case "bcBC":
        a = Math.sqrt(Math.pow(c, 2) - Math.pow(b, 2));
        A = (Math.asin(a / c) * 180) / Math.PI;
        break;
      case "bcABC":
        a = Math.sqrt(Math.pow(c, 2) - Math.pow(b, 2));
        break;
    }
  }
</script>

<h1 class="mb-3 text-3xl font-bold">Trekantsberegner</h1>

{#if !isCorrectAmountOfDataIsFilled}
  <div class="alert alert-error mb-2 shadow-lg">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>Ikke nok data!</span>
    </div>
  </div>
{/if}
{#if !areAnglesValid}
  <div class="alert alert-error mb-2 shadow-lg">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>Alle vinkler angivet, men vinkelsummen er ikke 180°</span>
    </div>
  </div>
{/if}
{#if !areSidesValid}
  <div class="alert alert-warning mb-2 shadow-lg">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        /></svg
      >
      <span>Alle sider angivet, men Pythagoras' læresætning er ikke opfyldt (a² + b² = c²)</span>
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && a == null) ||
          (isCorrectAmountOfDataIsFilled == false && a == undefined)
            ? 'border-error'
            : ''} 
            {areSidesValid == false ? 'border-warning' : ''}"
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && b == null) ||
          (isCorrectAmountOfDataIsFilled == false && b == undefined)
            ? 'border-error'
            : ''} 
            {areSidesValid == false ? 'border-warning' : ''}"
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && c == null) ||
          (isCorrectAmountOfDataIsFilled == false && c == undefined)
            ? 'border-error'
            : ''} 
            {areSidesValid == false ? 'border-warning' : ''}"
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && A == null) ||
          (isCorrectAmountOfDataIsFilled == false && A == undefined)
            ? 'border-error'
            : ''} 
            {areAnglesValid == false ? 'border-error' : ''}"
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && B == null) ||
          (isCorrectAmountOfDataIsFilled == false && B == undefined)
            ? 'border-error'
            : ''} 
            {areAnglesValid == false ? 'border-error' : ''}"
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
          class="input-bordered input w-full max-w-xs 
            {(isCorrectAmountOfDataIsFilled == false && C == null) ||
          (isCorrectAmountOfDataIsFilled == false && C == undefined)
            ? 'border-error'
            : ''} 
            {areAnglesValid == false ? 'border-error' : ''}"
        />
      </label>
    </div>
  </div>
</div>

<div class="flex flex-row">
  <button class="btn-primary btn mt-2" on:click={() => calculate()}>Beregn</button>
  <button class="btn mt-2 ml-2" on:click={() => reset()}>Reset</button>
</div>
