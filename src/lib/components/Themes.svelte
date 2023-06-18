<script>
  import { hexToHSL, mono, readable, darken } from "$lib/js/Utils.js";

  if (localStorage.getItem("themeOverride")) {
    let theme = JSON.parse(localStorage.getItem("themeOverride"));
    setCustomTheme(theme);
  }
  let themes = JSON.parse(localStorage.getItem("themes"));
  if (themes === null || !Array.isArray(themes) || themes.length === 0) {
    themes = [];
  }

  function deleteTheme(i) {
    themes.splice(i, 1);
    localStorage.setItem("themes", JSON.stringify(themes));
    themes = JSON.parse(localStorage.getItem("themes"));
  }

  function setCustomTheme(theme) {
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
    document.documentElement.style.setProperty("--n", darken(darken(darken(hexToHSL(theme.base)))));
    document.documentElement.style.setProperty("--nf", darken(darken(darken(darken(hexToHSL(theme.base))))));
    document.documentElement.style.setProperty("--in", "198 93% 60%"); //Default color
    document.documentElement.style.setProperty("--inc", "198 100% 12%"); //Default color
    document.documentElement.style.setProperty("--su", "158 64% 52%"); //Default color
    document.documentElement.style.setProperty("--suc", "158 100% 10%"); //Default color
    document.documentElement.style.setProperty("--wa", "43 96% 56%"); //Default color
    document.documentElement.style.setProperty("--wac", "43 100% 11%"); //Default color
    document.documentElement.style.setProperty("--er", "0 91% 71%"); //Default color
    document.documentElement.style.setProperty("--erc", "0 100% 14%"); //Default color
    // set theme in localstorage
    localStorage.setItem("themeOverride", JSON.stringify(theme));
  }
</script>

<li>
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="light"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="light"
      data-act-class="outline"
    >
      <div data-theme="light" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="dark"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="dark"
      data-act-class="outline"
    >
      <div data-theme="dark" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="winter"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="winter"
      data-act-class="outline"
    >
      <div data-theme="winter" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="lectio"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="lectio"
      data-act-class="outline"
    >
      <div data-theme="lectio" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="night"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="night"
      data-act-class="outline"
    >
      <div data-theme="night" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="garden"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="garden"
      data-act-class="outline"
    >
      <div data-theme="garden" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="dracula"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="dracula"
      data-act-class="outline"
    >
      <div data-theme="dracula" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
  <button
    class="mx-0 my-1 p-0 hover:scale-110"
    data-set-theme="coffee"
    data-act-class="ACTIVECLASS"
    on:click={() => {
      if (localStorage.getItem("themeOverride")) {
        localStorage.removeItem("themeOverride");
        location.reload();
      }
    }}
  >
    <div
      class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
      data-set-theme="coffee"
      data-act-class="outline"
    >
      <div data-theme="coffee" class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
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
        on:click={() => setCustomTheme(theme)}
      >
        <p class="text-sm font-bold" style="color: hsl({theme.baseContent});">{theme.name}</p>
        <button on:click={() => deleteTheme(i)} class="text-sm font-bold" style="color: hsl({theme.baseContent});"> X </button>
      </button>
    {/each}
  {/key}
{/await}
<div class="divider" />
<li class="my-1">
  <a class="rainbow btn font-black content-center-btn" href="/tema">Lav et nyt tema</a>
</li>

<style>
  .content-center-btn {
    align-content: center !important;
  }

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
