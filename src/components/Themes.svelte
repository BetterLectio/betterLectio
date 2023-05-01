<script>
  let themes = JSON.parse(localStorage.getItem("themes"));
  if (themes === null || !Array.isArray(themes) || themes.length === 0) {
    themes = [];
  }

  function deleteTheme(i) {
    themes.splice(i, 1);
    localStorage.setItem("themes", JSON.stringify(themes));
    themes = JSON.parse(localStorage.getItem("themes"));
  }

  function setTheme(theme) {
    document.documentElement.style.setProperty("--p", hexToHSL(theme.primary));
    document.documentElement.style.setProperty("--pf", darken(hexToHSL(theme.primary)));
    document.documentElement.style.setProperty("--pc", readable(hexToHSL(theme.primary)));
    document.documentElement.style.setProperty("--s", hexToHSL(theme.secondary));
    document.documentElement.style.setProperty("--sf", darken(hexToHSL(theme.secondary)));
    document.documentElement.style.setProperty("--sc", readable(hexToHSL(theme.secondary)));
    document.documentElement.style.setProperty("--a", hexToHSL(theme.accent));
    document.documentElement.style.setProperty("--af", darken(hexToHSL(theme.accent)));
    document.documentElement.style.setProperty("--ac", readable(hexToHSL(theme.accent)));
    document.documentElement.style.setProperty("--b1", hexToHSL(theme.base));
    document.documentElement.style.setProperty("--b2", darken(hexToHSL(theme.base)));
    document.documentElement.style.setProperty("--b3", darken(darken(hexToHSL(theme.base))));
    document.documentElement.style.setProperty("--bc", mono(readable(darken(darken(hexToHSL(theme.base))))));
    document.documentElement.style.setProperty("--nc", mono(readable(darken(darken(hexToHSL(theme.base))))));
    document.documentElement.style.setProperty("--n", mono(darken(darken(hexToHSL(theme.base)))));
    document.documentElement.style.setProperty("--nf", mono(darken(darken(darken(hexToHSL(theme.base))))));
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
</script>

<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="light" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="light"
      data-act-class="outline"
    >
      <div data-theme="light" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Lys</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="dark" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="dark"
      data-act-class="outline"
    >
      <div data-theme="dark" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Mørk</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="winter" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="winter"
      data-act-class="outline"
    >
      <div data-theme="winter" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Vinter</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="lectio" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="lectio"
      data-act-class="outline"
    >
      <div data-theme="lectio" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Lectio</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="night" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="night"
      data-act-class="outline"
    >
      <div data-theme="night" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Nat</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="garden" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="garden"
      data-act-class="outline"
    >
      <div data-theme="garden" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Natur</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="dracula" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="dracula"
      data-act-class="outline"
    >
      <div data-theme="dracula" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Slik</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>
<li>
  <button class="mx-0 my-1 p-0 hover:scale-110" data-set-theme="coffee" data-act-class="ACTIVECLASS">
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="coffee"
      data-act-class="outline"
    >
      <div data-theme="coffee" class="w-full cursor-pointer bg-base-100 font-sans text-base-content">
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
            <div class="flex-grow text-sm font-bold">Kaffe</div>
            <div class="flex flex-shrink-0 flex-wrap gap-1">
              <div class="w-2 rounded bg-primary" />
              <div class="w-2 rounded bg-secondary" />
              <div class="w-2 rounded bg-accent" />
              <div class="w-2 rounded bg-neutral" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</li>

{#await themes then}
  {#key themes}
    {#each themes as theme, i}
      <button
        class="rounded-lg w-full h-10 my-1 justify-between flex items-center px-4 py-3"
        style="background-color: {theme.base};"
        on:click={() => setTheme(theme)}
      >
        <p class="text-sm font-bold" style="color: hsl({theme.baseContent});">{theme.name}</p>
        <button on:click={() => deleteTheme(i)} class="text-sm font-bold" style="color: hsl({theme.baseContent});">
          X
        </button>
      </button>
    {/each}
  {/key}
{/await}
<div class="divider" />
<li class="my-1">
  <a class="rainbow btn font-black" href="/tema">Lav et nyt tema</a>
</li>

<style>
  .rainbow {
    -webkit-animation: Animation 6s ease infinite;
    -moz-animation: Animation 6s ease infinite;
    animation: Animation 6s ease infinite;
  }

  @-webkit-keyframes Animation {
    0% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
    50% {
      color: HSL(var(--sc));
      background-color: HSL(var(--s));
    }
    100% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
  }
  @-moz-keyframes Animation {
    0% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
    50% {
      color: HSL(var(--sc));
      background-color: HSL(var(--s));
    }
    100% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
  }
  @keyframes Animation {
    0% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
    50% {
      color: HSL(var(--sc));
      background-color: HSL(var(--s));
    }
    100% {
      color: HSL(var(--pc));
      background-color: HSL(var(--p));
    }
  }
</style>
