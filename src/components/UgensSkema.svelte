<script>
  import { onMount } from "svelte";
  import { get } from "./http";
  import { skema } from "./store.js";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import List from "@event-calendar/list";
  import DayGrid from "@event-calendar/day-grid";

  let customTheme = {
    active: "ec-active",
    allDay: "ec-all-day relative",
    bgEvent: "ec-bg-event",
    bgEvents: "ec-bg-events",
    body: "ec-body border rounded-b-2xl",
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
    event:
      "btn btn-xs absolute overflow-hidden text-black border-none hover:shadow-xl ml-0.5 hover:scale-110 z-10 hover:z-0",
    eventBody: "ec-event-body",
    eventTag: "ec-event-tag",
    eventTime: "ec-event-time",
    eventTitle: "ec-event-title",
    events: "ec-events",
    extra: "ec-extra",
    ghost: "ec-ghost",
    handle: "ec-handle",
    header: "ec-header rounded-t-2xl",
    hiddenScroll: "ec-hidden-scroll",
    hiddenTimes: "ec-hidden-times",
    highlight: "ec-highlight",
    icon: "ec-icon",
    line: "",
    lines: "",
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
    sidebar: "ec-sidebar mr-4 ml-2",
    sidebarTitle: "hidden",
    time: "ec-time",
    title: "ec-title",
    today: "bg-base-300",
    toolbar: "ec-toolbar",
    uniform: "ec-uniform",
    week: "ec-week border-base-content",
    withScroll: "ec-with-scroll",
  };

  let ec; // Event Calendar
  let weekOffset = 0;
  let loadedWeeks = [0];

  let plugins = [TimeGrid];
  let options = {
    locale: new Intl.DateTimeFormat("da-DK").resolvedOptions().locale,
    view: getDesiredView(),
    events: [],
    allDaySlot: false,
    nowIndicator: true,
    firstDay: 1,
    theme: customTheme,
    flexibleSlotTimeLimits: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "17:00:00",
    eventDidMount: (event) => {
      event.el.innerHTML = `<a href="/modul?absid=${event.event.id}">${event.el.innerHTML}</a>`;
    },
    viewDidMount: (view) => {
      getSkema(weekOffset);
      let btnNext = document.querySelector(".ec-next");
      let btnPrev = document.querySelector(".ec-prev");
      let today = document.querySelector(".ec-today");
      btnNext.addEventListener("click", () => {
        if (getDesiredView() == "timeGridWeek") {
          weekOffset++;
          load();
        } 
      });
      btnPrev.addEventListener("click", () => {
        if (getDesiredView() == "timeGridWeek") {
          weekOffset--;
          load();
        }
      });
      today.addEventListener("click", () => {
        if (getDesiredView() == "timeGridWeek") {
          weekOffset = 0;
          load();
        } 
      });
    },
  };

  function load() {
    let isWeekLoaded = isIn(weekOffset, loadedWeeks);
    loadedWeeks.push(weekOffset);
    if (!isWeekLoaded) {
      getSkema(weekOffset);
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

  function getSkema(weekOffset) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeekNr = getWeekNumber() + weekOffset;
    let moduler = [];

    get(`/skema?uge=${currentWeekNr}&år=${currentYear}`).then((data) => {
      $skema = data;
      moduler = $skema["moduler"];

      moduler.forEach((modul) => {
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

        let modulObj = {
          title: titel,
          start: new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`),
          end: new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`),
          id: modul["absid"],
          backgroundColor: className,
        };
        ec.addEvent(modulObj);
      });
    });
  }

  function isIn(thing, arr = []) {
    // this function tests if thins is in arr if so, return true else return false
    return arr.includes(thing);
  }

  function getDesiredView() {
    if (window.visualViewport.width < 768) {
      return "timeGridDay";
    } else {
      return "timeGridWeek";
    }
  }
</script>

<div class="rounded-lg bg-base-300 p-4">
  <Calendar bind:this={ec} {plugins} {options} />
</div>