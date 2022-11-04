<script>
    import { loop_guard } from "svelte/internal";


    let brugernavn = "";
    let adgangskode = "";
    let skole_id = "";

    let options = { "": "" };
    function updateOptions() {
        lectioAPI
            .getInstList()
            .then((data) => {
                Object.entries(data).forEach(([key, value]) => {
                    if (value.name != 'Vis alle skoler') {
                        options[key] = value;
                    }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/gh/Asguho/LectioJS/api.js"></script>
</svelte:head>

<div>
    <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
                <div class="shadow sm:overflow-hidden sm:rounded-md">
                    <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="col-span-3 sm:col-span-2">
                                <p class="text-gray-700 text-xl font-bold">
                                    Log ind med din Lectio konto
                                </p>
                                <br />
                                <label
                                    for="brugernavn"
                                    class="block text-sm font-medium text-gray-700"
                                    >Brugernavn</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 w-28"
                                        >Brugernavn</span
                                    >
                                    <input
                                        type="text"
                                        name="brugernavn"
                                        id="brugernavn"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                        placeholder="abcd1"
                                        bind:value={brugernavn}
                                    />
                                </div>
                                <label
                                    for="adgangskode"
                                    class="block text-sm font-medium text-gray-700"
                                    >Adgangskode</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 w-28"
                                        >Adgangskode</span
                                    >
                                    <input
                                        type = "password"
                                        name="adgangskode"
                                        id="adgangskode"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                        placeholder="abcdefgh"
                                        bind:value={adgangskode}
                                    />
                                </div>
                                <label
                                    for="skole"
                                    class="block text-sm font-medium text-gray-700"
                                    >Vælg skole</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 w-28"
                                        >Skole</span
                                    >
                                    <select
                                        use:updateOptions
                                        type="text"
                                        name="skole"
                                        id="skole"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                        placeholder="Vælg din skole"
                                        bind:value={skole_id}
                                    >
                                        <option disabled selected>
                                            Vælg din skole
                                        </option>
                                        {#each Object.entries(options) as [key, value] (key)}
                                            <option value={value.id}>
                                                {value.name}
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div
                                type="submit"
                                class="btn btn-primary AOC"
                                style="user-select: none"
                                on:click={async () => {
                                    if (brugernavn == "" || adgangskode == "" || skole_id == "") {
                                        alert("Du skal udfylde alle felter");} else {
                                        console.log("Logging into lectio");
                                        let progress = document.querySelector(".AOC");
                                        progress.classList.add("loading");
                                        const response = await fetch(`https://better-lectio-flask-backend.vercel.app/auth?brugernavn=${brugernavn}&adgangskode=${adgangskode}&skole_id=${skole_id}`)

                                        console.log("Log in was successful")
                                        progress.classList.remove("loading");
                                        const authentication = await response.text()
                                        console.log(authentication)
                                    }
                                }}>
                                Log ind
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
