<script>
    let alldayGreetings = ["Velkommen tilbage", "Hejsa", "Velkommen", "Hej"];
    let morningGreetings = ["God morgen", "Go' morgen", "Godmorgen"];
    let afternoonGreetings = ["God eftermiddag"];
    let eveningGreetings = ["God aften", "Tak for i dag", "Godnat"];
    let chosenGreeting = "";
    let brugeren = '';
    let checked = false;
    // Get the current time
    let currentTime = new Date().getHours();
    if (Math.random() > 0.5) {
        if (currentTime >= 5 && currentTime < 12) {
        chosenGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
        }
        else if (currentTime >= 12 && currentTime < 17) {
            chosenGreeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
        }
        else {
            chosenGreeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
        }
    } else {
        chosenGreeting = alldayGreetings[Math.floor(Math.random() * alldayGreetings.length)];
    }
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
           <h1 class="text-3xl font-bold">{chosenGreeting}, {brugeren.navn}</h1>
    {/if}
    <br />
</body>