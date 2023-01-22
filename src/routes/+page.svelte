<script>
	import { fly } from "svelte/transition";
	import { quintIn, quintInOut, quintOut } from "svelte/easing";
</script>

<div class="flex flex-row xl:justify-around">
	<div>
		<h1
			class="text-6xl font-extrabold md:text-8xl lg:text-9xl px-2"
			in:fly={{ duration: 1000, y: 0, x: -50, easing: quintInOut }}
		>
			BetterLectio
		</h1>
		<p
			class="mb-6 text-2xl font-extrabold md:text-3xl lg:text-4xl px-2"
			in:fly={{ duration: 1000, y: -30, x: 0, easing: quintInOut, delay: 500 }}
		>
			- Den ultimative Lectio-forbedring!
		</p>
		<div class="w-fit rounded-lg bg-base-content p-4">
			<p class="font-semibold text-base-100 md:text-xl">
				Prøv BetterLectio i dag og oplev, hvordan det kan forbedre din Lectio-oplevelse
			</p>
			<div class="mt-4 flex flex-col md:flex-row">
				<a
					href="/download"
					class="btn-primary btn mb-2 md:mb-0"
					in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 700 }}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-download mr-2"
						viewBox="0 0 16 16"
					>
						<path
							d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
						/>
						<path
							d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
						/>
					</svg>Download (anbefalet)</a
				>
				<a
					href="https://app.betterlectio.dk"
					class="btn-secondary btn md:ml-4 md:mt-0"
					in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 1000 }}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-box-arrow-in-right mr-2"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
						/>
						<path
							fill-rule="evenodd"
							d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
						/>
					</svg>Åben app</a
				>
				<a
					href="https://app.betterlectio.dk/discord"
					target="_blank"
					class="btn mt-2 md:ml-4 md:mt-0"
					in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 1300 }}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						class="bi bi-discord mr-2"
						viewBox="0 0 16 16"
					>
						<path
							d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
						/>
					</svg>Discord</a
				>
			</div>
		</div>
	</div>
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		class="mx-0 hidden h-80 w-80 rotate-12 fill-current p-0 xl:flex"
	>
		<path
			d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
		/>
		<path
			d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
		/>
		<path
			d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
		/>
		<path
			d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
		/>
	</svg>
</div>

<div class="mt-6 rounded-lg bg-base-200 p-4">
	<h1 class="mb-2 text-4xl font-extrabold">Hvad er BetterLectio?</h1>
	<p class="h-fit w-fit font-bold">
		BetterLectio er på nuværende tidspunkt under udvikling, det betyder at der kan forekomme fejl og
		mangler.
	</p>

	<p>
		BetterLectio er en forbredelse af Lectio. Lectio er et dansk webbaseret lektionssystem udviklet
		af det danske softwarefirma MaCom A/S. Vi har udviklet BetterLectio for at gøre det nemmere at
		bruge Lectio. Vi har fokuseret på at gøre det nemmere at finde informationer, og at gøre det
		nemmere at få overblik over sin skolegang. Vi har lavet en række andre forbedringer som f.eks.
		at lave en hel ny brugerflade, som både er mere brugervenlig og mere moderne.
	</p>

	<p class="mt-2 font-semibold">
		BetterLectio er et open source projekt, hvilket betyder at alle kan se koden, og alle kan
		bidrage til projektet. Hvis du har nogle forslag til forbedringer, eller hvis du har fundet en
		fejl, så er du meget velkommen til åbne en issue, eller lave en pull request.
	</p>
</div>
