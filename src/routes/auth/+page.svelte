<script>
  import { AES } from "crypto-es/lib/aes";
  import { Utf8 } from "crypto-es/lib/core";
  import { reloadData, api } from "$lib/js/http";
  import { cookieInfo } from "$lib/js/CookieInfo";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  const key =
    "Ting som encrypter login data meget simplet så det ikke er vildt nemt at få fat i fra et andet program. BTW du kan kun gemme login hvis du kører appen, det virker altså ikke på hjemmesiden.";

  let brugernavn = "";
  let adgangskode = "";
  let skole_id = "";
  let options = { "": "" };
  onMount(async () => {
    if (new URLSearchParams(window.location.search).get("redirect") || (await localStorage.getItem("lectio-cookie"))) {
      const data = await window.navigator.credentials.get({
        password: true,
        mediation: "optional",
      });
      console.log(data);
      if (data.type == "password") {
        const response = await fetch(`${api}/auth`, {
          headers: {
            brugernavn: data.id,
            adgangskode: data.password,
            skole_id: skole_id,
          },
        });
        if (response.ok) {
          await localStorage.setItem("lectio-cookie", await response.headers.get("set-lectio-cookie"));
          window.location.href = decodeURIComponent(new URLSearchParams(window.location.search).get("redirect") || "/forside");
        }
      }
    }
  });

  let redirectTo = new URLSearchParams(window.location.search).get("redirect");
  decodeURIComponent(redirectTo) == "null" ? (redirectTo = "/forside") : (redirectTo = decodeURIComponent(redirectTo));

  function tryLoginInWithCookie() {
    if (localStorage.getItem("lectio-cookie") || localStorage.getItem("lectio-cookie") != "null") {
      fetch(`${api}/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
      }).then((res) => {
        res.json().then((data) => {
          if (data?.valid) {
            console.log("Logged in with cookie");
            window.location.href = decodeURIComponent(redirectTo);
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

  let saveLogin = true;

  fetch(`${api}/skoler`).then((data) => {
    data.json().then((data) => {
      options = data;
    });
  });

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
      const response = await fetch(`${api}/auth`, {
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
        setSkole();
        if (saveLogin && window.electron) {
          localStorage.setItem("brugernavn", AES.encrypt(brugernavn, key));
          localStorage.setItem("adgangskode", AES.encrypt(adgangskode, key));
          localStorage.setItem("skole_id", skole_id);
        } else {
          localStorage.removeItem("brugernavn");
          localStorage.removeItem("adgangskode");
          localStorage.removeItem("skole_id");
        }
        let lectioCookie = await response.headers.get("set-lectio-cookie");
        if (lectioCookie && lectioCookie != "null") {
          localStorage.setItem("lectio-cookie", lectioCookie);
        }
        await cookieInfo().then(async (cookie) => {
          await fetch(`https://db.betterlectio.dk/bruger?bruger_id=${cookie.userid}&skole_id=${cookie.school}`);
        });
        progress.classList.remove("loading");
        reloadData();
        const originalLink = decodeURIComponent(redirectTo);
        window.location.href = originalLink;
      }
    }
  }

  function handleEnterLogin(e) {
    if (e.key === "Enter") {
      login();
    }
  }

  if (localStorage.getItem("brugernavn") && localStorage.getItem("adgangskode") && localStorage.getItem("skole_id")) {
    brugernavn = AES.decrypt(localStorage.getItem("brugernavn"), key).toString(Utf8);
    adgangskode = AES.decrypt(localStorage.getItem("adgangskode"), key).toString(Utf8);
    skole_id = localStorage.getItem("skole_id");

    login();
  }
</script>

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
<div use:getCachedSchool class="flex items-center justify-center md:h-[75vh]">
  <div class="h-fit rounded-2xl bg-base-200 p-4 shadow-lg">
    <h1 class="text-xl font-bold">Log ind med din Lectio konto</h1>
    <div class="divider mt-0" />
    <form action="login" autocomplete="on" method="post">
      <div class="form-control w-full max-w-xl">
        <label class="input-group-horizontal input-group mb-2">
          <span class="w-28 border-r-2 border-base-200 bg-base-100">Brugernavn</span>
          <input
            type="text"
            name="username"
            id="username-field"
            placeholder="Skriv her"
            class="input input-sm w-[calc(100%-7rem)] font-semibold autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
            bind:value={brugernavn}
          />
        </label>
        <label class="input-group-horizontal input-group mb-2">
          <span class="w-28 border-r-2 border-base-200 bg-base-100">Kodeord</span>
          <input
            type="password"
            name="adgangskode"
            id="adgangskode"
            placeholder="Skriv her"
            class="input input-sm w-[calc(100%-7rem)] font-semibold autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
            bind:value={adgangskode}
            on:keypress={handleEnterLogin}
          />
        </label>
        <label class="input-group-horizontal input-group mb-2">
          <span class="w-28 border-r-2 border-base-200 bg-base-100">Skole</span>
          <select
            name="skole"
            id="skole"
            placeholder="Vælg din skole"
            class="select select-sm w-[calc(100%-7rem)] py-0"
            bind:value={skole_id}
          >
            <option disabled selected> Vælg din skole </option>
            {#each Object.entries(options) as [key, value] (key)}
              <option value={value.id}>{value.skole}</option>
            {/each}
          </select>
        </label>
        {#if window.electron}
          <label class="label w-full cursor-pointer">
            <span class="block text-sm font-medium text-gray-700">Forbliv logget ind</span>
            <input
              type="checkbox"
              id="saveLogin"
              class="checkbox-primary checkbox"
              checked={saveLogin}
              on:click={() => {
                saveLogin = !saveLogin;
              }}
              name="setSkole"
            />
          </label>
        {/if}
        <label class="label w-full cursor-pointer">
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
        <div class="divider" />
        <p class="text-xs">
          Denne side bruger cookies til at huske dine oplysninger til næste gang du logger ind. Når du logger ind accepterer du at din
          browser gemmer dine oplysninger. De gemmes kun på din browser og bliver ikke sendt til nogen server bortset fra Lectio og vores
          proxy/translation layer.
          <span class="font-bold">Når du logger ind accepterer du automatisk vores</span>
          <a class="font-medium text-blue-600 hover:underline dark:text-blue-500" href="/tos">Servicevilkår & Privatlivspolitik</a>
        </p>
        <div class="divider" />
        <div class="flex justify-end">
          <div type="submit" class="AOC btn-primary btn" style="user-select: none" on:click={login}>Log ind</div>
        </div>
      </div>
    </form>
  </div>
</div>

<style>
</style>
