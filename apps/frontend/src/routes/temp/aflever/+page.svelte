<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores';

	const exerciseid = $page.url.searchParams.get('id');
	if (!exerciseid) alert("Intet opgave id");

	async function uploadOpgave(event: SubmitEvent) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const response = await fetch(`http://localhost:5000/aflever_opgave?exerciseid=${exerciseid}`, {
            method: 'POST',
            body: formData,
            headers: { 'lectio-cookie': $authStore.cookie || '' }
        });
        alert(await response.text());
    }
</script>


<div class="page-container">
	<h1>Opgave aflevering (demo)</h1>
	<form enctype="multipart/form-data" on:submit|preventDefault={uploadOpgave}>
		<input name="note" type="text" placeholder="Note" />
		<input name="opgave" type="file">
		<button type="submit">Upload</button>
	</form>
</div>
