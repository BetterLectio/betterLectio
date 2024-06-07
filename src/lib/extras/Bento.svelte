<script>
	import { Sun, Moon, Shield, Check, CheckCheck } from "lucide-svelte";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/button.svelte";
</script>

<div
	class="relative grid grid-cols-2 gap-2 p-2 md:gap-4 md:p-4 lg:grid-cols-3 grid-rows-8 xl:grid-cols-5 xl:grid-rows-5 lg:grid-rows-8 xl:aspect-video"
	data-theme="light"
>
	<div
		class="col-span-2 col-start-1 row-start-6 lg:col-start-1 xl:col-start-4 xl:row-start-1 lg:row-start-8"
	>
		<Card.Root class="w-full h-full border-2 filter backdrop-blur-lg bg-background/95">
			<Card.Header class="lg:py-2">
				<Card.Title>Hvad Er BetterLectio?</Card.Title>
			</Card.Header>
			<Card.Content class="text-sm leading-tight">
				BetterLectio er udviklet med det formål at gøre det lettere at bruge Lectio ved at tilføje
				flere funktioner og forbedringer. Disse inkluderer en mere brugervenlig og moderne
				brugerflade, lettere adgang til information og bedre overblik over ens skolegang.
			</Card.Content>
		</Card.Root>
	</div>
	<div
		class="col-start-1 row-span-3 row-start-2 lg:col-start-3 lg:row-start-2 xl:col-start-5 xl:row-start-2"
	>
		<Card.Root
			class="flex flex-col justify-between w-full h-full border-2 filter backdrop-blur-lg bg-background/95"
		>
			<Card.Header>
				<Card.Title>Understøtter alle platforme</Card.Title>
			</Card.Header>
			<Card.Content class="*:flex *:justify-between *:items-center">
				<div>
					<span>Windows</span>
					<CheckCheck class="size-5" />
				</div>
				<div>
					<span>MacOS</span>
					<Check class="size-5" />
				</div>
				<div>
					<span>Linux</span>
					<Check class="size-5" />
				</div>
				<div>
					<span>iOS</span>
					<Check class="size-5" />
				</div>
				<div>
					<span>Android</span>
					<Check class="size-5" />
				</div>
			</Card.Content>
			<Card.Footer>
				<p class="text-xs italic">
					Styresystemer markeret med
					<CheckCheck class="inline-flex size-4" />
					har en dedikeret app såvel som en webversion. De resterende styresystemer har kun en webversion.
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
	<div class="col-start-2 lg:col-start-3 xl:col-start-5 xl:row-start-5 lg:row-start-8 row-start-12">
		<Card.Root
			class="flex flex-col items-center justify-center w-full h-full border-2 filter backdrop-blur-lg bg-background/95"
		>
			<p class="text-5xl font-bold">&</p>
			<p class="text-2xl font-bold">Meget mere!</p>
		</Card.Root>
	</div>
	<div class="col-start-1 lg:col-start-3 row-start-12 lg:row-start-5 xl:col-span-2">
		<Card.Root class="w-full h-full border-2 filter backdrop-blur-lg bg-background/95">
			<Card.Header class="pb-3">
				<Card.Title>Af studerende, til studerende</Card.Title>
			</Card.Header>
			<Card.Content>
				<img src="https://contrib.rocks/image?repo=BetterLectio/betterlectio" alt="" />
			</Card.Content>
		</Card.Root>
	</div>
	<div
		class="col-span-2 col-start-1 row-span-3 row-start-7 lg:col-start-1 lg:row-start-3 xl:col-start-3 xl:row-start-2"
	>
		<Card.Root
			class="relative w-full h-full overflow-hidden border-2 filter backdrop-blur-lg bg-background/95"
		>
			<Card.Header>
				<Card.Title>Et værktøj <br /> du kan stole på</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-sm max-w-28">
					BetterLectio har i over et år leveret en stabil tjeneste til hudredevis af elever på
					gymnasier og erhvervsskoler i hele landet.
				</p>
			</Card.Content>
			<enhanced:img
				src="/static/2phones.png"
				alt="phones"
				class="absolute inset-0 object-cover w-full h-full rounded-lg aspect-video ml-11 md:ml-6"
			/>
		</Card.Root>
	</div>
	<div class="col-start-1 row-start-1">
		<Card.Root
			class="flex flex-col items-center justify-center w-full h-full border-2 filter backdrop-blur-lg bg-background/95"
		>
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				class="p-0 mx-0 fill-current h-14 w-14"
				><path
					d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
				></path><path
					d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
				></path><path
					d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
				></path><path
					d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
				></path></svg
			>
			<p class="text-2xl font-bold">BetterLectio</p>
		</Card.Root>
	</div>
	<div
		class="col-span-2 col-start-1 row-span-2 min-h-60 lg:col-start-2 row-start-10 lg:row-start-6 xl:col-start-1 xl:row-start-4"
	>
		<Card.Root class="relative w-full h-full border-2 filter backdrop-blur-lg bg-background/95">
			<Card.Header>
				<Card.Title>Vink farvel til Lectio's <br /> forældede design</Card.Title>
				<enhanced:img
					src="/static/3phones.png"
					alt="phones"
					class="absolute inset-0 object-cover w-full h-full rounded-lg aspect-video"
				/>
			</Card.Header>
		</Card.Root>
	</div>
	<div class="col-start-2 row-span-2 row-start-1">
		<Card.Root class="w-full h-full border-2 filter backdrop-blur-lg bg-background/95">
			<Card.Header>
				<Card.Title class="leading-snug"
					>Overfør Dine Moduler Og Opgaver Problemfrit Til Din Google Kalender</Card.Title
				>
			</Card.Header>
			<Card.Content class="flex items-center justify-center w-full h-1/2">
				<Button size="sm" href="#">Prøv Nu!</Button>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="col-start-2 row-start-3 lg:col-start-3 lg:row-start-1">
		<Card.Root
			class="flex flex-col items-center justify-center w-full h-full border-2 filter backdrop-blur-lg bg-background/95"
		>
			<p class="text-5xl font-bold">100%</p>
			<p class="text-2xl font-bold">Gratis</p>
			<p>Uden reklamer</p>
		</Card.Root>
	</div>
	<div
		class="col-start-2 row-span-2 row-start-4 lg:col-start-1 lg:row-start-6 xl:col-start-1 xl:row-start-2"
	>
		<Card.Root class="w-full h-full border-2 filter backdrop-blur-lg bg-background/95">
			<Card.Header>
				<Card.Title class="leading-snug">Early Bird eller Night Owl? Vi Har Dig Dækket!</Card.Title>
			</Card.Header>
			<Card.Content class="flex items-center justify-center w-full h-1/2">
				<div
					class="w-28 h-14 rounded-lg border-border border-[1px] flex justify-between items-center pr-4"
				>
					<div
						class="w-[calc(50%-8px)] rounded-sm ml-2 aspect-square flex justify-center items-center m-2 bg-foreground text-background"
						data-det-her-er-lorte-kode
					>
						<Sun />
					</div>
					<Moon />
				</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="col-start-1 row-start-5 lg:col-start-1 lg:row-start-2 xl:col-start-2 xl:row-start-3">
		<Card.Root
			class="relative w-full h-full overflow-hidden border-2 filter backdrop-blur-lg bg-background/95"
		>
			<Card.Header>
				<Card.Title class="text-sm leading-snug">
					BetterLectio har autologin, så du slipper for at logge ind <em>hver</em> gang
				</Card.Title>
			</Card.Header>
			<span class="absolute top-0 right-0">
				<Shield class="translate-x-16 opacity-25 size-40" />
			</span>
		</Card.Root>
	</div>
	<enhanced:img
		src="/static/bento_back.png"
		alt="background"
		class="absolute inset-0 object-cover w-full md:h-[calc(100%-16px)] h-[calc(100%-8px)] rounded-2xl aspect-video -z-20"
	/>
</div>
