<script>
    let lektier = [];
    async function checkIfAuthed() {
    if (localStorage.getItem("authentication") == null) {
        console.log("Redirect")
        window.location.href = "/auth";
    } else {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/check-cookie?cookie=${localStorage.getItem("authentication")}`
        );
        if (await response.json()["valid"] == false) {
            console.log("Redirect")
            window.location.href = "/auth";
        }
    }

    await fålektier()
    }
    async function fålektier() {
        const response = await fetch(
            `https://better-lectio-flask-backend.vercel.app/lektier?cookie=${localStorage.getItem("authentication")}`
        );
        lektier = await response.json()
        console.log(lektier);
    }
</script>
<body use:checkIfAuthed>
    <h1 class="text-3xl font-bold">Lektier</h1>
    <br/>
    <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl md:w-fit">
        {#each lektier as lektie}
            <li class="">
                <a href="https://www.lectio.dk/{lektie.lektier.link}"><p>{lektie.aktivitet.hold, lektie.aktivitet.lokale}</p></a>
            </li>
        {/each}
    </ul>
</body>

