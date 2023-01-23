<script>
  let isCalculatible = false;

  $: a = document.getElementById("a").value;
  $: b = document.getElementById("b").value;
  $: c = document.getElementById("c").value;
  $: A = document.getElementById("A").value;
  $: B = document.getElementById("B").value;
  $: C = document.getElementById("C").value;

  let areAngleValid = true;
  $: checkAngles = () => {
    if (A == "" || B == "" || C == "") {
      areAngleValid = false;
    }

    if (A + B + C == 180) {
      areAngleValid = true;
    } else {
      areAngleValid = false;
    }
  }

</script>

<h1 class="mb-3 text-3xl font-bold">Trekantsberegner</h1>

{#if !isCalculatible}
  <div class="alert alert-error shadow-lg mb-2">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Ikke not data!</span>
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
          value=""
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
          on:input={() => {
            
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
          value=""
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
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
          value=""
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
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
          value=""
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
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
          value=""
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
        />
      </label>
    </div>
    <div class="form-control m-2">
      <label class="input-group-md input-group">
        <span>C</span>
        <input
          type="number"
          placeholder="C"
          value="90"
          disabled
          id="C"
          class="input-bordered input w-full max-w-xs {isCalculatible == false ? 'border-error' : ''}"
        />
      </label>
    </div>
  </div>
</div>

<button class="btn btn-primary mt-2" on:click={() => calculate()}>Beregn</button>
