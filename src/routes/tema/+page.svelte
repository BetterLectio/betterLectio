<script>
  let p;
  $: if (p) {
    document.documentElement.style.setProperty("--p", hexToHSL(p));
    document.documentElement.style.setProperty("--pf", darken(hexToHSL(p)));
    document.documentElement.style.setProperty("--pc", readable(hexToHSL(p)));
  }

  let s;
  $: if (s) {
    document.documentElement.style.setProperty("--s", hexToHSL(s));
    document.documentElement.style.setProperty("--sf", darken(hexToHSL(s)));
    document.documentElement.style.setProperty("--sc", readable(hexToHSL(s)));
  }

  let a;
  $: if (a) {
    document.documentElement.style.setProperty("--a", hexToHSL(a));
    document.documentElement.style.setProperty("--af", darken(hexToHSL(a)));
    document.documentElement.style.setProperty("--ac", readable(hexToHSL(a)));
  }

  let b;
  $: if (b) {
    document.documentElement.style.setProperty("--b1", hexToHSL(b));
    document.documentElement.style.setProperty("--b2", darken(hexToHSL(b)));
    document.documentElement.style.setProperty("--b3", darken(darken(hexToHSL(b))));
    document.documentElement.style.setProperty("--bc", mono(readable(darken(darken(hexToHSL(b))))));
    document.documentElement.style.setProperty("--nc", mono(readable(darken(darken(hexToHSL(b))))));
    document.documentElement.style.setProperty("--n", mono(darken(darken(hexToHSL(b)))));
    document.documentElement.style.setProperty("--nf", mono(darken(darken(darken(hexToHSL(b))))));
  }

  function HSLToHex(col) {
    col = col.replace("%", "");
    col = col.split(" ");
    let h = col[1].replace("%", ""),
      s = col[2].replace("%", ""),
      l = col[3].replace("%", "");
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  }

  function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return h + " " + s + "% " + l + "%";
  }

  function readable(HSL) {
    HSL = HSL.split(" ");
    let h = HSL[0],
      s = HSL[1],
      l = HSL[2];
    s = s.replace("%", "");
    l = l.replace("%", "");
    s /= 100;
    l /= 100;
    if (l < 0.35) {
      l = l + 1;
    } else {
      l = l - 2;
    }
    return h + " " + s * 100 + "% " + l * 100 + "%";
  }

  function darken(HSL) {
    HSL = HSL.split(" ");
    let h = HSL[0],
      s = HSL[1],
      l = HSL[2];
    l = l.replace("%", "");
    l /= 100;
    l = l - 0.1;
    s = s.replace("%", "");
    s /= 100;
    s = s + 0.2;
    return h + " " + s * 100 + "% " + l * 100 + "%";
  }

  function mono(HSL) {
    HSL = HSL.split(" ");
    let h = HSL[0],
      s = HSL[1],
      l = HSL[2];
    s = s.replace("%", "");
    l = l.replace("%", "");
    s /= 100;
    l /= 100;
    s = 0;
    return h + " " + s * 100 + "% " + l * 100 + "%";
  }

  $: canSave = p != null && s != null && a != null && b != null ? true : false;

  let temaName = "unavngivet tema";

  function saveTema() {}
</script>

<h1 class="mb-4 text-3xl font-bold">Lav et tema</h1>

<div class="flex w-full flex-col md:flex-row">
  <div class="m-2 w-full rounded-lg bg-base-200 p-4 md:max-w-xs">
    <div class="form-control">
      <label class="label cursor-pointer items-center">
        <span class="label-text">Primær</span>
        <input type="color" class="input-primary" id="p" bind:value={p} />
      </label>
    </div>
    <div class="form-control">
      <label class="label cursor-pointer items-center">
        <span class="label-text">Sekundær</span>
        <input type="color" class="input-primary" id="s" bind:value={s} />
      </label>
    </div>
    <div class="form-control">
      <label class="label cursor-pointer items-center">
        <span class="label-text">Accent</span>
        <input type="color" class="input-primary" id="a" bind:value={a} />
      </label>
    </div>
    <div class="divider" />
    <div class="form-control">
      <label class="label cursor-pointer items-center">
        <span class="label-text">Base farve</span>
        <input type="color" class="input-primary" id="b" bind:value={b} />
      </label>
    </div>
  </div>
  <div class="m-2 w-full rounded-lg bg-base-200 p-4">
    <h2 class="mb-3 text-xl font-bold">Test dit tema</h2>
    <button class="btn-primary btn">primær farve</button>
    <button class="btn-secondary btn">sekundær farve</button>
    <button class="btn-accent btn">accent farve</button>
    <div class="divider" />
    <div class="w-full rounded-lg bg-base-300 p-4">
      <p>Her er noget tekst!</p>
    </div>
  </div>
</div>
<div class="divider" />
{#if canSave}
  <div class="m-2 w-full rounded-lg bg-base-200 p-4">
    <h2 class="mb-3 text-xl font-bold">Gem dit tema</h2>
    <div class="form-control">
      <label class="label max-w-xs">
        <span class="label-text">Tema navn</span>
        <input type="text" placeholder="Tema navn" class="input-bordered input" bind:value={temaName} />
      </label>
      <button class=" btn w-fit" on:click={saveTema}>Gem</button>
    </div>
  </div>
{/if}

<style>
</style>
