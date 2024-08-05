<script>
	let submissionStatus = null;
	function handleSubmit(formEvent) {
		// Perform any additional logic or validation here

		submissionStatus = 'submitting';
		fetch('https://docs.google.com/forms/d/e/1FAIpQLSeKEUooxFgla0U_mLkBldI3TYSW-4xHT3hPr7X8OmRR9lcruQ/formResponse', {
			method: 'POST',
			body: new FormData(formEvent.target),
			mode: 'no-cors',
			headers: { 'Access-Control-Allow-Origin': '*' }
		})
			.then(response => {
				// Handle the response as needed
				console.log('Form submitted successfully');
				submissionStatus = 'success';
			})
			.catch(error => {
				// Handle any errors that occurred during form submission
				console.error('Form submission error:', error);
				submissionStatus = 'error';
			});
	}
</script>

<div class="flex flex-col lg:flex-row w-full lg:h-[600px] bg-base-200 rounded-3xl shadow-xl">
	<div class="w-full lg:2/3 xl:w-2/5  p-8">
		<h1 class="heading">
			Rapporter feil
		</h1>
		<p>
			Har du fundet en fejl i BetterLectio eller har du et forslag til en ny funktion? Så kan du rapportere det her.
		</p>
		<div class="divider"></div>
		<form action="https://docs.google.com/forms/d/e/1FAIpQLSeKEUooxFgla0U_mLkBldI3TYSW-4xHT3hPr7X8OmRR9lcruQ/formResponse" on:submit|preventDefault={handleSubmit}>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Titel</span>
				</div>
				<input type="text" name="entry.1225663860" id="entry.1225663860" placeholder="Giv rapporten en titel" class="input input-bordered w-full max-w-xl " />
			</label>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Beskrivelse</span>
				</div>
				<textarea name="entry.1826682129" id="entry.1826682129" class="textarea textarea-bordered h-24 resize-none" placeholder="Beskriv fejlen samt hvordan du fandt den"></textarea>
			</label>
			<!--submit-->
			{#if submissionStatus}
				{#if submissionStatus === 'submitting'}
					<button class="btn btn-primary btn-sm mt-4 loading no-animation cursor-wait" disabled></button>
				{:else if submissionStatus === 'success'}
					<button class="btn btn-success btn-sm mt-4 no-animation cursor-default" on:click|preventDefault>Sendt!</button>
				{:else if submissionStatus === 'error'}
					<button class="btn btn-error btn-sm mt-4 no-animation cursor-default" on:click|preventDefault>Kunne ikke sende</button>
				{/if}
			{:else}
				<button class="btn btn-primary btn-sm mt-4">Send rapport</button>
			{/if}
		</form>
	</div>
	<div class="w-full hidden lg:1/3 xl:w-3/5 lg:flex p-8 h-full bg-base-content rounded-3xl items-center justify-center text-base-100">
		<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" fill="currentColor" class="bi bi-bug antialiased" viewBox="0 0 16 16">
			<path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
		</svg>
	</div>
</div>
<p class="mt-10 text-base-content/30 text-xs">Fejl rapportering sker gennem Google Forms. Du kan se alle deres <a href="https://policies.google.com/terms?hl=da" target="_blank" rel="noopener noreferrer">vilkår og betingelser her</a>.</p>

