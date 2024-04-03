<script lang="ts">
	let username = '';
	let password = '';
	let schoolId = '';

	let cookie: string | null = null;

	async function login() {
		await fetch(`https://api.betterlectio.dk/auth`, {
			headers: {
				brugernavn: username,
				adgangskode: password,
				skoleid: schoolId
			}
		})
			.then((res) => {
				console.log(res.headers.get('Set-Lectio-Cookie'));
				cookie = res.headers.get('Set-Lectio-Cookie');
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<div>
	<input id="username" bind:value={username} />
	<input id="password" bind:value={password} />
	<input id="schoolId" bind:value={schoolId} />
	<button on:click={login}>login</button>
	<p class="w-48">{cookie}</p>
</div>
