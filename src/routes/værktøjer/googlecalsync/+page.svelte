<script>
  import CryptoJS from "crypto-es";

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  let loggedin = false;

  //weeknr = url param "week"
  let weeknr = new URLSearchParams(window.location.search).get("week");

  $: if (weeknr) {
    console.log(weeknr);
  }

  const secretKey = "meget hemmelig nøgle"; // TODO: flyt til .env eller pin kode indtastning eller noget ¯\_(ツ)_/¯

  const start = async () => {
    const CLIENT_ID = "24684948206-14gdudquegcmmekdkfk2ud0isq4i2bnj.apps.googleusercontent.com";
    const API_KEY = "AIzaSyA8zKy_id5K_c7_HvmueBjRf_EB-8n0-z4";
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    document.getElementById("authorize_button").style.visibility = "hidden";
    document.getElementById("signout_button").style.visibility = "hidden";

    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });
    gisInited = true;
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
    handleAutoAuth();
  };

  const initializeGapi = async () => {
    gapi.load("client", start);
  };

  function handleAutoAuth() {
    const ciphertext = localStorage.getItem("G-apitoken");
    if (ciphertext === null) {
      return;
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //se if token is expired
    if (token !== null && token.expires_at < Date.now()) {
      loggedin = false;
      localStorage.removeItem("G-apitoken");
      return;
    }
    if (token !== null) {
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "genopfrisk adgang";
      gapi.client.setToken(token);
      loggedin = true;
    }
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "genopfrisk adgang";
      loggedin = true;

      //save token to localstorage
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify({ ...gapi.client.getToken(), expires_at: Date.now() + 3600000 }),
        secretKey
      ).toString();
      localStorage.setItem("G-apitoken", ciphertext);
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  function handleSignoutClick() {
    //remove token from localstorage
    localStorage.removeItem("G-apitoken");

    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      document.getElementById("authorize_button").innerText = "Log ind";
      document.getElementById("signout_button").style.visibility = "hidden";
      loggedin = false;
    }
  }

  function createEvent() {
    let d = convertLectioTime("29/05-2021 17:00 til 20:00");
    var event = {
      summary: "TEST",
      start: {
        dateTime: d[0],
        timeZone: "Europe/Copenhagen",
      },
      end: {
        dateTime: d[1],
        timeZone: "Europe/Copenhagen",
      },
    };
    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    request.execute((event) => {
      console.log(`Event created: ${event.htmlLink}`);
    });
  }

  function convertLectioTime(dateString) {
    const [startDateString, endDateString] = dateString.split(" til ");
    const [startDay, startMonth, startYear, startHour, startMinute] = startDateString.match(/\d+/g);
    const [endHour, endMinute] = endDateString.match(/\d+/g);

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}T${startHour}:${startMinute}:00`);
    const endDate = new Date(`${startYear}-${startMonth}-${startDay}T${endHour}:${endMinute}:00`);

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();
    return [formattedStartDate, formattedEndDate];
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client"></script>
  <script src="https://apis.google.com/js/api.js" on:load={initializeGapi}></script>
</svelte:head>

<h1 class="heading">Google Kalender-synkronisering</h1>

{#if !loggedin}
  <div class="alert alert-warning mb-4">
    <!-- prettier-ignore -->
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg >
    <span
      >Adgang er på nuværende tidspunkt begrænset til udviklere. Hvis du er interesseret i at teste funktionen, så kontakt os på discorden.</span
    >
  </div>
{:else}
  <p class="text-sm md:w-96 italic my-4 border-l-2 pl-2 border-warning">
    Google Kalender-synkronisering er en funktion, der gør det muligt at synkronisere dine moduler fra BetterLectio til din Google Kalender.
    Hvis du synkroniserer en uge, du tidligere har synkroniseret, vil de gamle events ikke altid blive slettet. Hvis du har problemer med
    funktionen, så kontakt os på Discord.
  </p>
{/if}

<button class="btn btn-sm" id="authorize_button" on:click={handleAuthClick}>Log ind</button>
<button class="btn btn-sm" id="signout_button" on:click={handleSignoutClick}>Log ud</button>

<div class="divider" />

{#if loggedin}
  <div class="join">
    <input class="input input-bordered join-item" bind:value={weeknr} placeholder="Uge Nr." />
    <button class="btn btn-primary join-item">synkroniser</button>
  </div>
{/if}
