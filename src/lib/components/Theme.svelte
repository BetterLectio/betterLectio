<script>
	export let themeName = 'NO NAME';

	export let daisyTheme = 'light';
</script>

<button
	class="mx-0 my-1 p-0 hover:scale-110"
	data-set-theme={daisyTheme}
	data-act-class="ACTIVECLASS"
	on:click={() => {
		if (localStorage.getItem('themeOverride')) {
			localStorage.removeItem('themeOverride');
			location.reload();
		}
	}}
>
	<div
		class="w-full overflow-hidden rounded-lg text-left outline outline-2 outline-offset-2 outline-base-content"
		data-set-theme={daisyTheme}
		data-act-class="outline"
	>
		<div data-theme={daisyTheme} class="w-[182px] cursor-pointer bg-base-100 font-sans text-base-content">
			<div class="grid grid-cols-5 grid-rows-3">
				<div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
					<div class="flex-grow text-sm font-bold">{themeName}</div>
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
