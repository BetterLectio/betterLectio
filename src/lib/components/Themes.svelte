<script>
	import { darken, hexToHSL, mono, readable } from '$lib/js/Utils.js';
	import Theme from '$lib/components/Theme.svelte';

	let themes = JSON.parse(localStorage.getItem('themes'));
	if (themes === null || !Array.isArray(themes) || themes.length === 0) themes = [];

	function deleteTheme(i) {
		themes.splice(i, 1);
		localStorage.setItem('themes', JSON.stringify(themes));
		themes = JSON.parse(localStorage.getItem('themes'));
	}

	function setCustomTheme(theme) {
		document.documentElement.style.setProperty('--p', hexToHSL(theme.primary));
		document.documentElement.style.setProperty('--pf', darken(hexToHSL(theme.primary)));
		document.documentElement.style.setProperty('--pc', readable(hexToHSL(theme.primary)));
		document.documentElement.style.setProperty('--s', hexToHSL(theme.secondary));
		document.documentElement.style.setProperty('--sf', darken(hexToHSL(theme.secondary)));
		document.documentElement.style.setProperty('--sc', readable(hexToHSL(theme.secondary)));
		document.documentElement.style.setProperty('--a', hexToHSL(theme.accent));
		document.documentElement.style.setProperty('--af', darken(hexToHSL(theme.accent)));
		document.documentElement.style.setProperty('--ac', readable(hexToHSL(theme.accent)));
		document.documentElement.style.setProperty('--b1', hexToHSL(theme.base));
		document.documentElement.style.setProperty('--b2', darken(hexToHSL(theme.base)));
		document.documentElement.style.setProperty('--b3', darken(darken(hexToHSL(theme.base))));
		document.documentElement.style.setProperty('--bc', mono(readable(darken(darken(hexToHSL(theme.base))))));
		document.documentElement.style.setProperty('--nc', mono(readable(darken(darken(hexToHSL(theme.base))))));
		document.documentElement.style.setProperty('--n', darken(darken(darken(hexToHSL(theme.base)))));
		document.documentElement.style.setProperty('--nf', darken(darken(darken(darken(hexToHSL(theme.base))))));

		// default colors
		document.documentElement.style.setProperty('--in', '198 93% 60%');
		document.documentElement.style.setProperty('--inc', '198 100% 12%');
		document.documentElement.style.setProperty('--su', '158 64% 52%');
		document.documentElement.style.setProperty('--suc', '158 100% 10%');
		document.documentElement.style.setProperty('--wa', '43 96% 56%');
		document.documentElement.style.setProperty('--wac', '43 100% 11%');
		document.documentElement.style.setProperty('--er', '0 91% 71%');
		document.documentElement.style.setProperty('--erc', '0 100% 14%');

		// set theme in localstorage
		localStorage.setItem('themeOverride', JSON.stringify(theme));
	}

	if (localStorage.getItem('themeOverride')) {
		const theme = JSON.parse(localStorage.getItem('themeOverride'));
		setCustomTheme(theme);
	}
</script>

<Theme themeName="Lys" daisyTheme="light" />
<Theme themeName="Lectio" daisyTheme="lectio" />
<Theme themeName="Tropisk" daisyTheme="lemonade" />
<Theme themeName="Kærlig" daisyTheme="valentine" />
<Theme themeName="Mørk" daisyTheme="dark" />
<Theme themeName="Nedtonet" daisyTheme="business" />
<Theme themeName="Slik" daisyTheme="dracula" />
<Theme themeName="Nat" daisyTheme="night" />

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
	background: linear-gradient(60deg,
		hsl(var(--p)) 0%,
		hsl(var(--p)) 25%,
		hsl(var(--s)) calc(25% + 1px),
		hsl(var(--s)) 50%,
		hsl(var(--a)) calc(50% + 1px),
		hsl(var(--a)) 75%,
		hsl(var(--n)) calc(75% + 1px),
		hsl(var(--n)) 100%
	);
}
</style>
