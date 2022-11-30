<!--
  TODO: 
  load more data on week change ✅
  add a loading indicator
  add color to the events

-->
<script>
  import { onMount } from "svelte";
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
    button: "btn btn-primary btn-sm ONCHANGE",
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
    event: "btn btn-xs absolute overflow-hidden text-black border-none hover:shadow-xl",
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

  let globalWeek = 0;
  let globalYear = 0;
  let globalView = "timeGridWeek";
  let loadedWeeks = [getWeekNumber()];

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
    viewDidMount: (view) => {
      let rawDate = view.currentEnd.toISOString();
      console.log("viewDidMount", rawDate);
      let dateObj = new Date(rawDate);
      globalYear = dateObj.getFullYear();
      let dayOfYear = 2 + Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      globalWeek = Math.floor(dayOfYear / 7);
      console.log("viewDidMount", globalYear, globalWeek);
    },
  };
  let skema;

  // make a function that runs every time the screen is resized

  window.addEventListener("resize", () => {
    changeView();
  });

  function changeView() {
    if (ec) {
      // if the screen is less than 768px wide
      if (window.innerWidth < 768) {
        // set the calendar view to dayGrid
        ec.setOption("view", "timeGridDay");
      } else {
        // otherwise set the view to weekGrid
        ec.setOption("view", "timeGridWeek");
      }
    }
  }

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
      let status = modul["status"]; // can be "normal" "ændret" or "aflyst"
      let className;
      if (status == "normal") {
        className = "hsl(var(--in))";
      } else if (status == "ændret") {
        className = "hsl(var(--su))";
      } else {
        className = "hsl(var(--er))";
      }
      let modulCalenderObj = {
        title: titel,
        start: new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`),
        end: new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`),
        id: modul["absid"],
        backgroundColor: className,
      };
      ec.addEvent(modulCalenderObj);
    }
  }

  async function loadSkema(ugeNummer, år) {
    await fåSkema(ugeNummer, år);
    ec.refetchEvents();
  }

  function onload() {
    loadSkema(getWeekNumber(), new Date(Date.now()).getFullYear());
    let btns = document.getElementsByClassName("ONCHANGE");
    btns[0].addEventListener("click", () => {
      changeWeek("reset"); //minus 1 week
    });
    btns[1].addEventListener("click", () => {
      changeWeek("minus"); //plus 1 week
    });
    btns[2].addEventListener("click", () => {
      changeWeek("plus"); //plus 1 week
    });
  }
  onMount(() => {
    changeView()
    getWeekNumber();
    console.log(getWeekNumber());
    onload();
  });

  function changeWeek(task) {
    switch (task) {
      case "reset":
        globalWeek = getWeekNumber();
        globalYear = getWeekNumber();
        break;
      case "minus":
        globalWeek--;
        break;
      case "plus":
        globalWeek++;
        break;
    }
    console.log(loadedWeeks);
    let getWeek = true;
    for (let i = 0; i < loadedWeeks.length; i++) {
      if (loadedWeeks[i] == globalWeek) {
        getWeek = false;
      }
    }
    if (getWeek) {
      loadSkema(globalWeek, globalYear);
      loadedWeeks.push(globalWeek);
      return;
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
</svelte:head>

<h1 class="mb-4 text-3xl font-bold">Skema</h1>

<div>
  <Calendar bind:this={ec} {plugins} {options} />
</div>
