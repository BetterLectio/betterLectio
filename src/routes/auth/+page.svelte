<script>
  import { reloadData } from "../../components/http";
  import { cookieInfo } from "../../components/CookieInfo";

  let brugernavn = "";
  let adgangskode = "";
  let skole_id = "";
  let options = { "": "" };

  function tryLoginInWithCookie() {
    if (localStorage.getItem("lectio-cookie") || localStorage.getItem("lectio-cookie") != "null") {
      fetch(`https://api.betterlectio.dk/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
      }).then((res) => {
        res.json().then((data) => {
          if (data?.valid) {
            console.log("Logged in with cookie");
            window.location.href = "/forside";
          } else {
            console.log("Cookie not valid.", "valitation:", data);
          }
        });
      });
    }
  }
  tryLoginInWithCookie();

  async function setSkole() {
    await document.window;
    let checkbox = document.getElementById("saveSchoolIdCheck");
    checkbox.checked == true ? localStorage.setItem("skole_id", skole_id) : localStorage.removeItem("skole_id");
  }

  function updateOptions() {
    lectioAPI
      .getInstList()
      .then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          if (value.name != "Vis alle skoler") {
            options[key] = value;
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function getCachedSchool() {
    // load the schoolid from localstorage and set it to the select
    if (localStorage.getItem("skole_id")) {
      skole_id = localStorage.getItem("skole_id");
    }
  }

  async function login() {
    setSkole();
    if (brugernavn == "" || adgangskode == "" || skole_id == "") {
      document.querySelector("#MissingInfoAlert").checked = true;
      document.querySelector("#MissingInfoAlertX").addEventListener("click", () => {
        document.querySelector("#MissingInfoAlert").checked = false;
      });
    } else {
      console.log("Logging into lectio");
      let progress = document.querySelector(".AOC");
      progress.classList.add("loading");
      const response = await fetch(`https://api.betterlectio.dk/auth`, {
        headers: {
          brugernavn: brugernavn,
          adgangskode: adgangskode,
          skole_id: skole_id,
        },
      });
      //console.log("Log in was successful")
      const authentication = await response.text();
      //console.log(authentication)
      if (await !response.ok) {
        progress.classList.remove("loading");
        document.querySelector("#CantLogInAlert").checked = true;
        document.querySelector("#CantLogInAlertX").addEventListener("click", () => {
          document.querySelector("#CantLogInAlert").checked = false;
        });
      } else {
        const theme = localStorage.getItem("theme");
        const firstTime = localStorage.getItem("firstTime");
        localStorage.clear();
        localStorage.setItem("theme", theme);
        localStorage.setItem("firstTime", firstTime);
        setSkole();
        let lectioCookie = await response.headers.get("set-lectio-cookie");
        if (lectioCookie && lectioCookie != "null") {
          localStorage.setItem("lectio-cookie", lectioCookie);
        }
        await cookieInfo().then(async (cookie) => {
          await fetch(`https://db.betterlectio.dk/bruger?bruger_id=${cookie.userid}&skole_id=${cookie.school}`);
        });
        progress.classList.remove("loading");
        reloadData();
        window.location.href = "/forside";
      }
    }
  }

  function handleEnterLogin(e) {
    if (e.key === "Enter") {
      login();
    }
  }
</script>

<svelte:head>
  <script on:load={updateOptions} src="https://cdn.jsdelivr.net/gh/Asguho/LectioJS/api.js"></script>
</svelte:head>

<body use:getCachedSchool>
  <input type="checkbox" id="CantLogInAlert" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box relative">
      <label for="my-modal-3" id="CantLogInAlertX" class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
      <h3 class="text-lg font-bold">Kunne ikke logge ind</h3>
      <p class="py-4">Der skete en fejl, er du sikker på at du har indtastet dine oplysninger korrekt?</p>
    </div>
  </div>
  <input type="checkbox" id="MissingInfoAlert" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box relative">
      <label for="my-modal-3" id="MissingInfoAlertX" class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
      <h3 class="text-lg font-bold">Mangler info</h3>
      <p class="py-4">Du skal udfylde alle felterne for at logge ind.</p>
    </div>
  </div>
  <form autocomplete="on">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:col-span-2 md:mt-0">
        <form action="#" method="POST">
          <div class="shadow sm:overflow-hidden sm:rounded-md">
            <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3 sm:col-span-2">
                  <p class="text-xl font-bold text-gray-700">Log ind med din Lectio konto</p>
                  <br />
                  <label for="username" class="block text-sm font-medium text-gray-700">Brugernavn</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <span
                      class="inline-flex w-28 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                      >Brugernavn</span
                    >
                    <input
                      type="text"
                      name="username"
                      id="username-field"
                      class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="abcd1"
                      bind:value={brugernavn}
                    />
                  </div>
                  <label for="adgangskode" class="block text-sm font-medium text-gray-700">Adgangskode</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <span
                      class="inline-flex w-28 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                      >Adgangskode</span
                    >
                    <input
                      type="password"
                      name="adgangskode"
                      id="adgangskode"
                      class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="abcdefgh"
                      bind:value={adgangskode}
                      on:keypress={handleEnterLogin}
                    />
                  </div>
                  <label for="skole" class="block text-sm font-medium text-gray-700">Vælg skole</label>
                  <div class="mt-1 flex rounded-md shadow-sm">
                    <span
                      class="inline-flex w-28 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                      >Skole</span
                    >
                    <select
                      type="text"
                      name="skole"
                      id="skole"
                      class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Vælg din skole"
                      bind:value={skole_id}
                    >
                      <option disabled selected> Vælg din skole </option>
                      {#each Object.entries(options) as [key, value] (key)}
                        <option value={value.id}>
                          {value.name}
                        </option>
                      {/each}
                    </select>
                  </div>
                  <div class="my-2 w-32">
                    <label class="label cursor-pointer">
                      <span class="block text-sm font-medium text-gray-700">Gem skole</span>
                      <input
                        type="checkbox"
                        checked="checked"
                        id="saveSchoolIdCheck"
                        class="checkbox-primary checkbox"
                        on:click={setSkole()}
                        name="setSkole"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <p class="text-gray-700">
                Denne side bruger cookies til at huske dine oplysninger til næste gang du logger ind. Når du logger ind
                accepterer du at din browser gemmer dine oplysninger. De gemmes kun på din browser og bliver ikke sendt til
                nogen server bortset fra Lectio og vores proxy/translation layer.
                <br /><br />
                Når du logger ind accepterer du automatisk vores
                <a class="font-medium text-blue-600 hover:underline dark:text-blue-500" href="/tos">TOS</a>
              </p>
              <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div type="submit" class="AOC btn-primary btn" style="user-select: none" on:click={login}>Log ind</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </form>
</body>
