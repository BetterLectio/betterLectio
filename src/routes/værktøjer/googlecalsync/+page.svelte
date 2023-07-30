<script>
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  const start = async () => {
    console.log(gapi);
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
    console.log(gapiInited, gisInited);
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  };

  const initializeGapi = async () => {
    gapi.load("client", start);
  };

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById("signout_button").style.visibility = "visible";
      document.getElementById("authorize_button").innerText = "Refresh";
      //do something here!!!!
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
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      document.getElementById("content").innerText = "";
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
      //reload page
    }
    window.location.reload();
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

<button id="authorize_button" on:click={handleAuthClick}>Authorize</button>
<button id="signout_button" on:click={handleSignoutClick}>Sign Out</button>

<button id="no" on:click={createEvent}>add</button>
