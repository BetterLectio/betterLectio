<script>
    /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */

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
    <h3 class="text-xl">Her kan du se dine lektier for de kommende 14 dage</h3>
    <br/>
    <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl md:w-fit">
        {#each lektier as lektie}
            <li class="">
                <a href="/modul?absid={lektie.aktivitet.absid}">
                    <div>
                        <p><span class="font-bold">{(lektie.aktivitet.navn != null) ? lektie.aktivitet.navn + " · " : ""}{lektie.aktivitet.hold}</span> ({lektie.aktivitet.tidspunkt})</p>
                        <p>{lektie.lektier.beskrivelse}</p>
                    </div>
                </a>
            </li>
        {/each}
    </ul>
</body>

