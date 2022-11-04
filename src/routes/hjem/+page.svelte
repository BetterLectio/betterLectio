<script>
    let brugeren = '';

    let checked = false;
    function checkIfAuthed() {
        if (localStorage.getItem("authentication") == null) {
            console.log("Redirect")
            window.location.href = "/";
        } else {
            checked = true;
        }

        fåBrugeren()
    }
    async function fåBrugeren() {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/mig?cookie=${localStorage.getItem("authentication")}`
        );
        brugeren = await response.json()
    }
</script>

<body use:checkIfAuthed>
    {#if brugeren != ''}
        <div>
            <p>Velkommen tilbage {brugeren.navn}</p>
        </div>
    {/if}
</body>