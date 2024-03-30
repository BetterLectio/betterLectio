<script>
	import { goto } from '$app/navigation';

	async function getToken() {
		const res = await fetch('/gen-offline-google-token');
		const token = await res.text();
		console.log(token);
		return token;
	}

	getToken().then(token => {
		goto(token);
	});
</script>
