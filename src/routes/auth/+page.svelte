<svelte:head>
    <script src="https://cdn.jsdelivr.net/gh/Asguho/LectioJS/api.js"></script>
</svelte:head>

<script>
    let value = "";
    let options = {"": ""};
    
    function updateOptions() {
        lectioAPI.getInstList().then((data) => {
            console.log(data)
            Object.entries(data).forEach(([key, value]) => {
                options[value.id] = value.name
            });
        }).catch((err) => {
            console.error(err);
        });
    }
</script>

<div>
    <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
                <div class="shadow sm:overflow-hidden sm:rounded-md">
                    <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="col-span-3 sm:col-span-2">
                                <p class="text-gray-700 text-xl">
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
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                                        >Brugernavn</span
                                    >
                                    <input
                                        type="text"
                                        name="brugernavn"
                                        id="brugernavn"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="elmu1"
                                    />
                                </div>
                                <label
                                    for="adgangskode"
                                    class="block text-sm font-medium text-gray-700"
                                    >Adgangskode</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                                        >Adgangskode</span
                                    >
                                    <input
                                        type="text"
                                        name="adgangskode"
                                        id="adgangskode"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="ljVsrVpt"
                                    />
                                </div>
                                <label
                                    for="skole"
                                    class="block text-sm font-medium text-gray-700"
                                    >Vælg skole</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                                        >Skole</span
                                    >
                                    <select
                                        use:updateOptions
                                        type="text"
                                        name="skole"
                                        id="skole"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Vælg din skole"
                                        {value}
                                    >
                                        <option disabled selected>
                                            Vælg din skole
                                        </option>
                                        {#each Object.entries(options) as [key, value] (key)}
                                            <option value={key}>
                                                {value}
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >Save</button
                            >
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
