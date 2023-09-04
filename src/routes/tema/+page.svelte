<script>
	import { darken, hexToHSL, mono, readable } from '$lib/js/Utils.js';
	import { addNotification } from '$lib/js/notifyStore.js';

	let pVar = null;
	$: if (pVar) {
		document.documentElement.style.setProperty('--p', hexToHSL(pVar));
		document.documentElement.style.setProperty('--pf', darken(hexToHSL(pVar)));
		document.documentElement.style.setProperty('--pc', readable(hexToHSL(pVar)));

		// Default colors
		document.documentElement.style.setProperty('--in', '198 93% 60%');
		document.documentElement.style.setProperty('--inc', '198 100% 12%');
		document.documentElement.style.setProperty('--su', '158 64% 52%');
		document.documentElement.style.setProperty('--suc', '158 100% 10%');
		document.documentElement.style.setProperty('--wa', '43 96% 56%');
		document.documentElement.style.setProperty('--wac', '43 100% 11%');
		document.documentElement.style.setProperty('--er', '0 91% 71%');
		document.documentElement.style.setProperty('--erc', '0 100% 14%');
	}

	let sVar = null;
	$: if (sVar) {
		document.documentElement.style.setProperty('--s', hexToHSL(sVar));
		document.documentElement.style.setProperty('--sf', darken(hexToHSL(sVar)));
		document.documentElement.style.setProperty('--sc', readable(hexToHSL(sVar)));
	}

	let aVar = null;
	$: if (aVar) {
		document.documentElement.style.setProperty('--a', hexToHSL(aVar));
		document.documentElement.style.setProperty('--af', darken(hexToHSL(aVar)));
		document.documentElement.style.setProperty('--ac', readable(hexToHSL(aVar)));
	}

	let bcVar = null;
	let bVar = null;
	$: if (bVar) {
		document.documentElement.style.setProperty('--b1', hexToHSL(bVar));
		document.documentElement.style.setProperty('--b2', darken(hexToHSL(bVar)));
		document.documentElement.style.setProperty('--b3', darken(darken(hexToHSL(bVar))));
		document.documentElement.style.setProperty('--bc', mono(readable(darken(darken(hexToHSL(bVar))))));

		// for use in save function
		bcVar = mono(readable(darken(darken(hexToHSL(bVar)))));
		document.documentElement.style.setProperty('--nc', mono(readable(darken(darken(hexToHSL(bVar))))));
		document.documentElement.style.setProperty('--n', darken(darken(darken(hexToHSL(bVar)))));
		document.documentElement.style.setProperty('--nf', darken(darken(darken(darken(hexToHSL(bVar))))));
	}

	$: if (pVar || sVar || aVar || bVar) localStorage.setItem('Previewing Theme', 'true');


	$: canSave = Boolean(pVar !== null && sVar !== null && aVar !== null && bVar !== null);

	let temaName = 'unavngivet tema';

	function saveTema() {
		// first if a localstorage item with the name "themes" does not exist, create it
		if (localStorage.getItem('themes') === null) localStorage.setItem('themes', JSON.stringify([]));


		// get the current themes
		const themes = JSON.parse(localStorage.getItem('themes'));

		// check if the name is already taken
		let nameTaken = false;
		for (const theme of themes) if (theme.name === temaName) nameTaken = true;

		// if the name is taken, alert the user
		if (nameTaken) {
			addNotification('Temaet findes allerede', 'alert-error');
			return;
		}

		// add the new theme to the array
		themes.push({
			name: temaName,
			primary: pVar,
			secondary: sVar,
			accent: aVar,
			base: bVar,
			baseContent: bcVar
		});

		// save the new array
		localStorage.setItem('themes', JSON.stringify(themes));
		localStorage.setItem('Previewing Theme', 'false');

		// reload the page
		location.reload();
	}
</script>

<h1 class="heading">Lav et tema</h1>

<div class="flex w-full flex-col md:flex-row">
	<div class="m-2 w-full rounded-lg bg-base-200 p-4 md:max-w-xs">
		<div class="form-control">
			<label class="label cursor-pointer items-center">
				<span class="label-text">Primær</span>
				<input type="color" class="input-primary" id="p" bind:value={pVar} />
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer items-center">
				<span class="label-text">Sekundær</span>
				<input type="color" class="input-primary" id="s" bind:value={sVar} />
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer items-center">
				<span class="label-text">Accent</span>
				<input type="color" class="input-primary" id="a" bind:value={aVar} />
			</label>
		</div>
		<div class="divider" />
		<div class="form-control">
			<label class="label cursor-pointer items-center">
				<span class="label-text">Base farve</span>
				<input type="color" class="input-primary" id="b" bind:value={bVar} />
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
				<input type="text" placeholder="Tema navn" class="input-bordered input" bind:value={temaName} maxlength="8" />
			</label>
			<button class=" btn w-fit" on:click={saveTema}>Gem</button>
		</div>
	</div>
{/if}

<style>
</style>
