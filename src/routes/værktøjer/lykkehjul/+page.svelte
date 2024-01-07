<script>
	import { ArcElement, CategoryScale, Chart as ChartJS, Colors, Legend, Title, Tooltip } from 'chart.js';
	import { Pie } from 'svelte-chartjs';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { get } from '$lib/js/http.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, ChartDataLabels, Colors);

	let page = 'hold';
	let holdOgGrupper = [];
	let selected = null;
	async function fåHoldOgGrupper() {
		const resp = await get('/skema');
		await resp.hold.forEach(hold => {
			holdOgGrupper = [...holdOgGrupper, hold];
		});
		await resp.grupper.forEach(hold => {
			holdOgGrupper = [...holdOgGrupper, hold];
		});
	}
	fåHoldOgGrupper();

	let medlemmer = [];
	let valgteMedlemmer = [];
	async function holdValgt(id) {
		selected = id;
		page = 'loading';

		medlemmer = await get(`/hold_medlemmer?id=${selected}`);
		medlemmer.forEach(medlem => {
			medlem.valgt = true;
		});
		valgteMedlemmer = medlemmer;

		page = 'medlemmer';
	}

	function toggleMedlem(id) {
		const medlem = medlemmer.find(_medlem => _medlem.bruger_id === id);
		if (medlem.valgt) valgteMedlemmer = [...valgteMedlemmer, medlem];
		else valgteMedlemmer = valgteMedlemmer.filter(valgtMedlem => valgtMedlem.bruger_id !== id);
	}

	const options = {
		responsive: true,
		events: [],
		plugins: {
			legend: { display: false },
			datalabels: {
				anchor: 'center',
				color: 'white',
				rotation(ctx) { // https://stackoverflow.com/questions/68030418/how-to-rotate-the-label-text-in-doughnut-chart-slice-vertically-in-chart-js-canv
					const valuesBefore = ctx.dataset.data.slice(0, ctx.dataIndex).reduce((a, b) => a + b, 0);
					const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
					const rotation = ((valuesBefore + (ctx.dataset.data[ctx.dataIndex] / 2)) / sum * 360);
					return rotation < 180 ? rotation - 90 : rotation + 90;
				},
				font: { size: 20 },
				formatter(value, context) {
					return context.chart.data.labels[context.dataIndex];
				}
			}
		}
	};

	const plugins = [ChartDataLabels];

	let degrees = 0;
	let vinderIndeks = null;
	function spin(element) {
		element.target.style.transition = 'all 1s ease-out';
		degrees += Math.round(Math.random() * 1000) + 1000;
		element.target.style.transform = `rotate(${degrees}deg)`;
		element.target.addEventListener('transitionend', () => {
			element.target.style.transition = 'none';
			vinderIndeks = medlemmer.indexOf(valgteMedlemmer[Math.ceil(valgteMedlemmer.length - (degrees % 360 / 360 * valgteMedlemmer.length)) - 1]);
			document.getElementById('vinder_modal').showModal();
		});
	}
</script>

<div class="grid md:grid-cols-3 gap-4">
	<div class="element overflow-hidden md:col-span-2 w-full">
		<h1 class="heading">Lykkehjul</h1>
		{#if valgteMedlemmer.length > 0}
			<p class="text-3xl text-center">↓</p>
			<Pie data={{
				labels: valgteMedlemmer.map(medlem => `${medlem.fornavn} ${medlem.efternavn}`),
				datasets: [
					{ data: valgteMedlemmer.map(() => 1) }
				]
			}} {options} {plugins} on:click={spin}/>
		{:else}
			<p class="text-center">Vælg et hold for at begynde</p>
		{/if}
	</div>
	<div class="element w-full">
		{#if page === 'hold'}
			<h3 class="font-bold text-xl mb-4">Vælg et hold</h3>
			<div class="space-y-2">
				{#each holdOgGrupper as hold }
					<button on:click={() => holdValgt(hold.id)} id={hold.id} class="btn {selected === hold.id ? 'btn-primary' : ''} w-full">
						{hold.navn}
					</button>
				{/each}
			</div>
		{:else if page === 'medlemmer'}
			<div class="flex justify-between">
				<h3 class="font-bold text-xl mb-4">Vælg medlemmer</h3>
				<button class="btn btn-secondary btn-sm" on:click={() => {
					page = 'hold';
				}}>Gå tilbage</button>
			</div>
			<div class="space-y-2">
				{#each medlemmer as medlem }
					<label class="label cursor-pointer">
						<span class="label-text">{medlem.fornavn} {medlem.efternavn}</span>
						<input type="checkbox" bind:checked={medlem.valgt} on:change={() => toggleMedlem(medlem.bruger_id)} class="checkbox" />
					</label>
				{/each}
			</div>
		{/if}
	</div>
</div>

<dialog id="vinder_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">{medlemmer[vinderIndeks]?.fornavn} {medlemmer[vinderIndeks]?.efternavn} har vundet!</h3>
		<p class="py-4">Du har nu 2 muligheder</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Behold</button>
				<button class="btn btn-primary" on:click={() => {
					medlemmer[vinderIndeks].valgt = false;
					toggleMedlem(medlemmer[vinderIndeks]?.bruger_id);
				}}>Fjern</button>
			</form>
		</div>
	</div>
</dialog>
