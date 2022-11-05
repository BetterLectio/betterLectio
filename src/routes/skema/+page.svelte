<script>
    let skema = '';

    let checked = false;
    function checkIfAuthed() {
        if (localStorage.getItem("authentication") == null) {
            console.log("Redirect")
            window.location.href = "/";
        } else {
            checked = true;
        }

        fåSkema()
    }
    async function fåSkema() {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/skema?cookie=${localStorage.getItem("authentication")}`
        );
        skema = await response.json()
    }
</script>

<h1 class="text-3xl font-bold">Skema</h1>
<br />
<body use:checkIfAuthed>
    {#if skema != ''}
        <div>
            <p>{JSON.stringify(skema)}</p>
        </div>
    {/if}
</body>
