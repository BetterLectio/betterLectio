<script>
  /*
    TODO:
        - Tag weekend med hvis der sker noget der
        - Lav en popup som kommer når man har musen over skemaet med flere informationer på modulerne
        - Skriv når et modul er annuleret ✅
        - Hav farver fra lectio med, f.eks. grøn=frivillig
        - Gør skemaet mobilt venligt ved kun at vise en dag i stedet for en hel uge ✅
        - Få skemaet til at blende ind med tailwind css ✅
    */
  import { get } from "../../components/http.js";

  import FullCalendar from "svelte-fullcalendar";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import daLocale from "@fullcalendar/core/locales/da";

  let normalModuleColors = ["bg-teal-", "bg-cyan-", "bg-sky-", "bg-blue-", "bg-indigo-", "bg-violet-"];

  let calendar;
  let calendarApi;

  let options = {
    initialView: "timeGridWeek",
    plugins: [timeGridPlugin],
    weekNumberCalculation: "ISO",
    locale: daLocale,
    weekends: false,
    height: "auto",

    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",

    slotDuration: "00:30:00",

    displayEventTime: true,
    nowIndicator: true,

    events: [],
    /*eventClick: function(info) {
            alert('Event: ' + info.event.title);
        },*/
    //eventMouseEnter: function(info) {
    //    console.log("Mus over: " + info.event.title);
    //    // Popup af en eller andet form som fortæller mere om modulet
    //},
    //eventMouseLeave: function(info) {
    //    console.log("Mus ikke længere over: " + info.event.title);
    //    // Fjern pop up
    //
    //}
  }; // ikke nødvendigt lige pt.

  let skema = "";

  Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  let loadedWeeks = [];
  async function viewChanged() {
    while (true) {
      if (calendarApi != undefined) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    let date = calendarApi.getDate();

    let år = date.getFullYear();
    let ugeNummer = date.getWeekNumber();

    if (!loadedWeeks.includes(`${ugeNummer}, ${år}`)) {
      fåSkema(ugeNummer, år);

      loadedWeeks.push(`${ugeNummer}, ${år}`);
    }
    styleCalendar();
  }

  async function fåSkema(ugeNummer, år) {
    skema = await get(`/skema?uge=${ugeNummer}&år=${år}`);

    let farve = 0;
    let preModulTeam = "";
    //skema = await response.json()
    skema["moduler"].forEach(function (modul) {
      let start = modul["tidspunkt"].split(" til ")[0];
      start = {
        dag: start.split("/")[0].length == 1 ? "0" + start.split("/")[0] : start.split("/")[0],
        måned:
          start.split("/")[1].split("-")[0].length == 1
            ? "0" + start.split("/")[1].split("-")[0]
            : start.split("/")[1].split("-")[0],
        år: start.split("-")[1].split(" ")[0],

        tidspunkt: start.split(" ")[1],
      };
      let slut = modul["tidspunkt"].split(" ")[0] + " " + modul["tidspunkt"].split(" til ")[1];
      slut = {
        dag: slut.split("/")[0].length == 1 ? "0" + slut.split("/")[0] : slut.split("/")[0],
        måned:
          slut.split("/")[1].split("-")[0].length == 1
            ? "0" + slut.split("/")[1].split("-")[0]
            : slut.split("/")[1].split("-")[0],
        år: slut.split("-")[1].split(" ")[0],

        tidspunkt: slut.split(" ")[1],
      };
      let titel = modul["navn"] != null ? modul["navn"] : modul["hold"];
      try {
        titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
      } catch (err) {}
      let color = "";
      if (modul["status"] == "aflyst") {
        color = "red";
      } else if (modul["status"] == "ændret") {
        color = "yellow";
      } else {
        color = "normal";
        if (preModulTeam == modul["hold"]) {
          color += ` ${farve % normalModuleColors.length}`;
        } else {
          farve++;
          color += ` ${farve % normalModuleColors.length}`;
        }
        preModulTeam = modul["hold"];
      }
      calendarApi.addEvent({
        title: titel,
        url: `/modul?absid=${modul["absid"]}`,
        start: `${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}:00`,
        end: `${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}:00`,
        defaultAllDay: false,
        classNames: [color],
      });
    });
    loadDagsNoter();
  }

  async function loadDagsNoter() {
    let year = calendarApi.getDate().getFullYear();
    skema["dagsNoter"].forEach(function (dagsNoter) {
      Object.entries(dagsNoter).forEach(([key, value]) => {
        let day =
          key.split("(")[1].split("/")[0].length == 1
            ? "0" + key.split("(")[1].split("/")[0]
            : key.split("(")[1].split("/")[0];
        let month =
          key.split("(")[1].split("/")[1].slice(0, -1).length == 1
            ? "0" + key.split("(")[1].split("/")[1].slice(0, -1)
            : key.split("(")[1].split("/")[1].slice(0, -1);
        value.forEach(function (dagsNote) {
          calendarApi.addEvent({
            title: dagsNote,
            defaultAllDay: true,
            date: `${year}-${month}-${day}`,
            classNames: ["allday"],
          });
        });
      });
    });

    styleCalendar();
  }

  function toggleWeekends() {
    options = {
      ...options,
      weekends: !options.weekends,
    };
  }

  async function bindCalendar() {
    while (true) {
      if (calendar != undefined) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    calendarApi = await calendar.getAPI();

    let width = window.innerWidth;
    if (width < 700) {
      calendarApi.today();
      calendarApi.changeView("timeGridDay");
    } else {
      let today = await new Date().getDay();
      if (today == 6 || today == 0) {
        calendarApi.next();
      }
    }

    const fcButtons = await document.getElementsByClassName("fc-button-primary");
    for (var i = 0; i < fcButtons.length; i++) {
      await fcButtons[i].addEventListener("click", viewChanged);
    }
  }
  bindCalendar();

  const styleCalendar = async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const events1 = document.getElementsByClassName("fc-v-event");
    const events2 = document.getElementsByClassName("fc-h-event");
    const events = [...events1, ...events2];
    for (var i = 0; i < events.length; i++) {
      let colorClass = "btn text-black btn-xs h-full w-full overflow-hidden";
      if (events[i].classList.contains("normal")) {
        for (var j = 0; j < normalModuleColors.length; j++) {
          if (events[i].classList.contains(j)) {
            let color = normalModuleColors[j];
            //colorClass = `${color}200 hover:text-white btn text-black btn-xs h-full w-full overflow-hidden`;
            break;
          }
        }
        colorClass = "btn btn-primary btn-xs h-full w-full overflow-hidden";
        // TODO make this work
      } else if (events[i].classList.contains("red")) {
        colorClass = "btn btn-error btn-xs h-full w-full overflow-hidden";
      } else if (events[i].classList.contains("allday")) {
        colorClass = "btn btn-primary btn-xs h-full w-full overflow-hidden";
      } else {
        colorClass = "btn btn-xs h-full w-full overflow-hidden btn-secondary";
      }
      events[i].className = colorClass;
    }

    const buttons = document.getElementsByClassName("fc-button");
    for (var i = 0; i <= buttons.length; i++) {
      buttons[i].className = "btn btn-primary btn-sm mr-4";
    }
    document.getElementsByClassName("fc-button-primary")[0].className = "btn btn-primary btn-sm"; // to fix the "prev" button
    const buttonGroup = document.getElementsByClassName("fc-button-group");
    for (var i = 0; i <= buttonGroup.length; i++) {
      buttonGroup[i].className = "btn-group";
    }
    const table = document.getElementsByClassName("fc-scrollgrid-sync-table");
    for (var i = 0; i <= table.length; i++) {
      table[i].className = "table table-bordered table-striped";
    }
    document.getElementsByClassName("fc-toolbar-title")[0].className = "text-xl p-4 font-bold";
    document.getElementsByClassName("fc-theme-standard")[0].className =
      "fc fc-media-screen border border-base-content rounded-2xl border border-2 overfolw-hidden";
    document.getElementsByClassName("fc-scrollgrid-section-sticky")[0].className = "bg-base-100";
  };
</script>

<h1 class="mb-4 text-3xl font-bold">Skema</h1>
<FullCalendar bind:this={calendar} {options} />
<body use:viewChanged>
  {#if skema != ""}
    <div>
      <p use:styleCalendar>{" "}</p>
    </div>
  {/if}
</body>
