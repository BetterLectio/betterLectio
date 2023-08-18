<script>
  import Theme from "$lib/components/Theme.svelte";
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

<Theme themeName="Lys" daisyTheme="light" />
<Theme themeName="Lectio" daisyTheme="lectio" />
<Theme themeName="Natur" daisyTheme="garden" />
<Theme themeName="Kærlig" daisyTheme="valentine" />
<Theme themeName="Mørk" daisyTheme="dark" />
<Theme themeName="Nedtonet" daisyTheme="business" />
<Theme themeName="Slik" daisyTheme="dracula" />
<Theme themeName="Nat" daisyTheme="night" />
<Theme themeName="Kaffe" daisyTheme="coffee" />

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
<div class="divider" />
<li class="my-1">
  <a class="rainbow btn font-black content-center-btn" href="/tema">Lav dit eget tema</a>
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
