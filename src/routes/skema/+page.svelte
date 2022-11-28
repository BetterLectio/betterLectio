<!--
  TODO: 
  load more data on week change
  add a loading indicator
  add color to the events

-->
<script>
  import { get } from "../../components/http.js";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  let ec; // to store the calendar instance and access it's methods
  let plugins = [TimeGrid];

  let customTheme = {
    active: "ec-active",
    allDay: "ec-all-day relative",
    bgEvent: "ec-bg-event",
    bgEvents: "ec-bg-events",
    body: "ec-body",
    button: "btn btn-primary btn-sm",
    buttonGroup: "btn-group",
    calendar: "ec",
    compact: "ec-compact",
    content: "ec-content",
    day: "ec-day",
    dayFoot: "ec-day-foot",
    dayHead: "ec-day-head",
    daySide: "ec-day-side",
    days: "ec-days",
    draggable: "ec-draggable",
    dragging: "ec-dragging",
    event: "btn btn-primary btn-xs absolute overflow-hidden",
    eventBody: "ec-event-body",
    eventTag: "ec-event-tag",
    eventTime: "ec-event-time",
    eventTitle: "ec-event-title",
    events: "ec-events",
    extra: "ec-extra",
    ghost: "ec-ghost",
    handle: "ec-handle",
    header: "ec-header",
    hiddenScroll: "ec-hidden-scroll",
    hiddenTimes: "ec-hidden-times",
    highlight: "ec-highlight",
    icon: "ec-icon",
    line: "ec-line",
    lines: "ec-lines",
    list: "ec-list",
    month: "ec-month",
    noEvents: "ec-no-events",
    nowIndicator: "ec-now-indicator",
    otherMonth: "ec-other-month",
    pointer: "ec-pointer",
    popup: "ec-popup",
    preview: "ec-preview",
    resizer: "ec-resizer",
    resizingX: "ec-resizing-x",
    resizingY: "ec-resizing-y",
    resource: "ec-resource",
    resourceTitle: "ec-resource-title",
    sidebar: "ec-sidebar",
    sidebarTitle: "ec-sidebar-title",
    time: "ec-time",
    title: "ec-title",
    today: "bg-base-300",
    toolbar: "ec-toolbar",
    uniform: "ec-uniform",
    week: "ec-week",
    withScroll: "ec-with-scroll",
  };

  let options = {
    view: "timeGridWeek",
    nowIndicator: true,
    theme: customTheme,
    hiddenDays: [0, 6],
    slotMinTime: "06:00:00",
    slotMaxTime: "18:00:00",
    events: [],
    eventDidMount: (event) => {
      // called when an event is mounted to the DOM
      // this makes the event clickable
      event.el.innerHTML = `<a href="/modul?absid=${event.event.id}">${event.el.innerHTML}</a>`;
    },
  };
  let skema;

  function getWeekNumber() {
    var d = new Date(Date.now());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  async function fåSkema(ugeNummer, år) {
    skema = await get(`/skema?uge=${ugeNummer}&år=${år}`);
    for (let i = 0; i < skema["moduler"].length; i++) {
      let modul = skema["moduler"][i];
      console.log(modul);
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
      let titel = "";
      if (modul["navn"] != undefined) {
        titel = modul["navn"] != null ? modul["navn"] : modul["hold"];
        if (modul["lokale"]) {
          titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
        }
      } else {
        titel = modul["hold"];
        if (modul["lokale"]) {
          titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
        }
      }
      let modulCalenderObj = {
        title: titel,
        start: new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`),
        end: new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`),
        id: modul["absid"],
      };
      ec.addEvent(modulCalenderObj);
    }
  }

  async function loadDagsNoter() {
    let year = new Date(Date.now()).getFullYear();
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
          console.log(parseInt(year), parseInt(month), parseInt(day));
          let note = {
            title: dagsNote,
            allDay: true,
            start: new Date(`${year}-${month}-${day}T00:00:00`),
          };
          ec.addEvent(note);
          console.log("?");
        });
      });
    });
  }

  async function loadSkema() {
    let ugeNummer = getWeekNumber();
    let år = new Date(Date.now()).getFullYear();
    await fåSkema(ugeNummer, år);
    await loadDagsNoter();
    ec.refetchEvents();
  }
  loadSkema();
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
</svelte:head>

<h1 class="mb-4 text-3xl font-bold">Skema</h1>

<div>
  <Calendar bind:this={ec} {plugins} {options} />
</div>
