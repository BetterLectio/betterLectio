<script>
  import CryptoJS from "crypto-es";

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

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
      localStorage.removeItem("G-apitoken");
      return;
    }
    if (token !== null) {
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "genopfrisk adgang";
      gapi.client.setToken(token);

      listUpcomingEvents();
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      alert(`Error: ${JSON.stringify(err)}`);
      return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
      alert("No upcoming events found.");
      return;
    }
    // Flatten to string to display
    const output = events.reduce((str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`, "Events:\n");
    alert(output);
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "genopfrisk adgang";
      listUpcomingEvents();
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
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
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

<h1 class="heading">Google kalender synkronisering</h1>

<div class="alert alert-warning mb-4">
  <!-- prettier-ignore -->
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg >
  <span
    >Adgang er på nuværende tidspunkt begrænset til udviklere. Hvis du er interesseret i at teste funktionen, så kontakt os på discorden.</span
  >
</div>

<button class="btn" id="authorize_button" on:click={handleAuthClick}>Synkroniser</button>
<button class="btn" id="signout_button" on:click={handleSignoutClick}>Log ud</button>
