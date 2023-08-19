<script>
  import { get } from "$lib/js/http.js";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import { indstillinger } from "$lib/js/store.js";
  import { HoldOversætter, HoldOversætterNy } from "$lib/js/HoldOversætter.js";
  import { fag, hold } from "$lib/js/store.js";

  import { cookieInfo } from "$lib/js/CookieInfo";
  import { error } from "@sveltejs/kit";
  import { goto } from "$app/navigation";

  let skema = {};
  let heading = "Skema";

  let mySkema;

  $fag ??= {};

  $: skemaId = new URLSearchParams(window.location.search).get("id");

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
    if (skemaId == null) {
      skemaId = "S" + cookie.userid;
      const url = new URL(location);
      url.searchParams.set("id", skemaId);
      history.replaceState({}, "", url);
    }
  });
  let ec; // to store the calendar instance and access it's methods
  let plugins = [TimeGrid];

  let customTheme = {
    active: "ec-active",
    allDay: "ec-all-day border-b-0 relative -mt-4 md:mt-0",
    bgEvent: "ec-bg-event",
    bgEvents: "ec-bg-events",
    body: "ec-body rounded-b-2xl",
    button: "btn btn-primary btn-sm ONCHANGE visible",
    buttonGroup: "btn-group visible",
    calendar: "ec-calendar school-schedule",
    compact: "ec-compact",
    content: "ec-content",
    day: "ec-day",
    dayFoot: "ec-day-foot",
    dayHead: "ec-day-head",
    daySide: "ec-day-side",
    days: "ec-days capitalize",
    draggable: "ec-draggable",
    dragging: "ec-dragging",
    event:
      "btn btn-xs absolute flex-nowrap w-full h-full overflow-hidden hover:shadow-[0_3px_12px_rgba(0,0,0,0.1)] visible hover:scale-105 z-5 hover:z-0 border-0 m-0.5",
    eventBody: "",
    eventTag: "ec-event-tag",
    eventTime: "ec-event-time",
    eventTitle: "ec-event-title",
    events: "ec-events",
    extra: "ec-extra",
    ghost: "ec-ghost",
    handle: "ec-handle",
    header: window.innerWidth < 768 ? "flex hidden" : "ec-header rounded-t-2xl",
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
    sidebar: "ec-sidebar",
    sidebarTitle: "hidden",
    time: "ec-time",
    title: "md:ec-title",
    today: "bg-base-300",
    toolbar:
      "flex items-center ec-toolbar bg-base-200 md:text-base-content md:bg-base-100 p-2 rounded-t-2xl -mt-8 md:mt-0 border border-base-content md:border-0",
    uniform: "ec-uniform",
    week: "ec-week",
    withScroll: "ec-hidden-scroll",
  };

  addEventListener("resize", (event) => {});

  onresize = (event) => {
    // if the window is less than 768px wide, change the view to "listDay"
    options.view = dertermineView();
  };

  function dertermineView() {
    if (window.innerWidth < 768) {
      return "timeGridDay";
    } else {
      return "timeGridWeek";
    }
  }

  let globalWeek = 0;
  let globalYear = 0;
  let addedEventsId = [];

  $: if (globalWeek) {
    console.log("week changed to: " + globalWeek);
    //add the week to the url
    //const url = new URL(location);
    //url.searchParams.set("week", globalWeek);
    //history.replaceState({}, "", url);
  }

  let options = {
    locale: "da",
    view: "timeGridWeek",
    nowIndicator: true,
    theme: customTheme,
    hiddenDays: [0, 6],
    flexibleSlotTimeLimits: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "17:00:00",
    events: [],
    dayHeaderFormat: { weekday: "long", day: "numeric", month: "numeric" },
    buttonText: {
      today: "I dag",
      dayGridMonth: "måned",
      listDay: "list",
      listWeek: "list",
      listMonth: "list",
      listYear: "list",
      resourceTimeGridDay: "dag",
      resourceTimeGridWeek: "uge",
      timeGridDay: "dag",
      timeGridWeek: "uge",
    },
    eventDidMount: (event) => {
      //if the event is cancelled, add a class to the event
      if (event.event.backgroundColor == "hsl(var(--er))") {
        event.el.classList.add("line-through", "hover:decoration-2");
      }
      if (event.event.extendedProps.hasContent) {
        event.el.classList.add(
          "after:text-base",
          "after:content-['_📖']",
          "after:px-1",
          "hover:after:content-['_📖']",
          "text-left",
          "justify-between"
        );
      } else {
        event.el.classList.add("text-left", "justify-start");
      }
    },
    viewDidMount: (view) => {
      dertermineView();
      let dateObj = new Date(view.currentEnd.toISOString());
      globalYear = dateObj.getFullYear();
      let dayOfYear = 2 + Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      globalWeek = Math.floor(dayOfYear / 7);
      onload();
    },
    eventClick: (info) => {
      goto(`/modul?absid=${info.event.id}`);
    },
  };

  $: if (skema?.[globalYear + "" + globalWeek]) {
    addSkemaToCalendar(skema[globalYear + "" + globalWeek]);
  }

  function getWeekNumber() {
    var d = new Date(Date.now());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  async function addSkemaToCalendar(skema) {
    options.view = dertermineView();
    const holdToColor = getHoldToColor();
    for (let i = 0; i < skema["moduler"].length; i++) {
      let modul = skema["moduler"][i];
      let start = modul["tidspunkt"].split(" til ")[0];
      start = {
        dag: start.split("/")[0].length == 1 ? "0" + start.split("/")[0] : start.split("/")[0],
        måned: start.split("/")[1].split("-")[0].length == 1 ? "0" + start.split("/")[1].split("-")[0] : start.split("/")[1].split("-")[0],
        år: start.split("-")[1].split(" ")[0],

        tidspunkt: start.split(" ")[1],
      };
      let slut = modul["tidspunkt"].split(" ")[0] + " " + modul["tidspunkt"].split(" til ")[1];
      slut = {
        dag: slut.split("/")[0].length == 1 ? "0" + slut.split("/")[0] : slut.split("/")[0],
        måned: slut.split("/")[1].split("-")[0].length == 1 ? "0" + slut.split("/")[1].split("-")[0] : slut.split("/")[1].split("-")[0],
        år: slut.split("-")[1].split(" ")[0],

        tidspunkt: slut.split(" ")[1],
      };
      let titel = "";
      let status = modul["status"]; // can be "normal" "ændret" "aflyst" or "eksamen"
      if (modul["hold_id"] != null && $fag[modul["hold_id"]] == undefined) {
        let _fag = await HoldOversætterNy(modul["hold_id"]);
        $fag[modul["hold_id"]] = _fag == "Andet" ? modul["hold"] : _fag;
      }
      if (modul["navn"] != undefined) {
        titel = modul["navn"] != null && modul["navn"] != "Ændret!" ? modul["navn"] : $fag[modul["hold_id"]];
        if (status == "eksamen") {
          titel =
            "Eksamen! " +
            titel.replace("mdt.", "mundtlig").replace("skr.", "skriftlig").replace("prv.", "prøve").replace("eks.", "eksamen");
        } else {
          if (modul["lokale"]) {
            titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
          }
        }
      } else {
        if ($indstillinger.brugHoldOversætter) {
          titel = $fag[modul["hold_id"]];
        } else {
          titel = modul["hold"];
        }
        if (modul["lokale"]) {
          titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
        }
      }
      let backgroundColor = "hsl(0, 0%, 0%, 0.1)";
      if (status == "normal" || status == "ændret") {
        if (holdToColor[modul.hold] && $indstillinger.skema.classesWithDifferentColors == true) {
          backgroundColor = `hsla(${holdToColor[modul.hold]}, 75%, 65%, 0.25)`;
        } else {
          backgroundColor = "hsla(212.5, 75%, 65%, 0.25)";
        }
      } else if (status == "eksamen") {
        backgroundColor = "hsla(262, 100%, 65%, 0.25)";
      }
      let hasContent = modul["andet"] == null ? false : true;
      //const backgroundColor = $indstillinger?.classesWithDifferentColors === true ? className : stringToHex(modul["hold"]);

      let modulCalenderObj = {
        title: titel,
        start: new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`),
        end: new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`),
        id: modul["absid"],
        backgroundColor,
        extendedProps: {
          hasContent: hasContent,
        },
      };
      let isAdded = false;
      for (let i = 0; i < addedEventsId.length; i++) {
        // check if it has been added before
        if (addedEventsId[i] === modulCalenderObj.id) {
          isAdded = true;
        }
      }
      if (!isAdded) {
        addedEventsId.push(modulCalenderObj.id);
        ec.addEvent(modulCalenderObj);
      }
    }
  }

  $: if (globalWeek && globalYear) {
    getSkema();
  }
  function getHoldToColor() {
    let holdToColor = {};
    try {
      if (!skema[globalYear + "" + globalWeek].hold) {
        throw error;
      }
      for (let i = 0; i < skema[globalYear + "" + globalWeek].hold.length; i++) {
        holdToColor[skema[globalYear + "" + globalWeek].hold[i].navn] = (255 / (skema[globalYear + "" + globalWeek].hold.length - 1)) * i;
      }
      return holdToColor;
    } catch (error) {
      console.log("could not get hold to color, proceeding with default");
      return holdToColor;
    }
  }

  function getSkema() {
    if (!skema) {
      skema = {};
    }
    get(`/skema?id=${skemaId}&uge=${globalWeek}&år=${globalYear}`).then((data) => {
      skema[globalYear + "" + globalWeek] = data;
      heading = skema?.[globalYear + "" + globalWeek]?.overskrift || "skema";

      mySkema = cookie.userid == skemaId.slice(1);

      options.slotMinTime = parseInt(
        Object.values(skema[globalYear + "" + globalWeek].modulTider)[0]
          .split(" - ")[0]
          .split(":")[0] - 1
      ).toString();
      options.slotMaxTime = (
        parseInt(
          Object.values(skema[globalYear + "" + globalWeek].modulTider)
            .slice(-1)[0]
            .split(" - ")[1]
            .split(":")[0]
        ) + 1
      ).toString();

      addButtonsToDagsnoter(globalYear, globalWeek);
    });
  }

  function onload() {
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

  function changeWeek(task) {
    switch (task) {
      case "reset":
        globalWeek = getWeekNumber();
        break;
      case "minus":
        globalWeek--;
        break;
      case "plus":
        globalWeek++;
        break;
    }
  }

  function addButtonsToDagsnoter(year, week) {
    let slots = document.getElementsByClassName("ec-day");
    let slotsFiltered = [];
    if (window.innerWidth < 768) {
      slotsFiltered.push(slots[1]);
    } else {
      for (let i = 0; i < slots.length; i++) {
        i >= 5 && i <= 9 ? slotsFiltered.push(slots[i]) : null;
      }
    }
    // add buttons to slots
    for (let i = 0; i < slotsFiltered.length; i++) {
      let infoobj = skema[year + "" + week].dagsNoter[i];
      const currentDay = Object.keys(infoobj)[0];
      const currentInfoArr = infoobj[currentDay];
      let currentInfo = `<p>`;
      for (let j = 0; j < currentInfoArr.length; j++) {
        currentInfo += currentInfoArr[j] + `</p><p>`;
      }
      slotsFiltered[i].innerHTML = `
      <div tabindex="0" class="collapse collapse-arrow">
        <div class="collapse-title font-medium">
          Se dagsnoter
        </div>
        <div class="collapse-content">
          ${currentInfo}
        </div>
      </div>
      `;
    }
  }
</script>

<div class="my-2 flex justify-between">
  <h1 class="heading">{heading}</h1>

  {#if cookie?.userid}
    <a
      class="btn hidden md:flex"
      href={`https://www.lectio.dk/lectio/${cookie.school}/studieplan.aspx?elevid=${cookie.userid}`}
      target="_blank"
    >
      Se studieplan
    </a>
  {/if}
</div>

<div class="translate-y-5 md:translate-y-0">
  <Calendar bind:this={ec} {plugins} {options} />
</div>

<div class="divider hidden md:flex" />
{#if mySkema}
  <a
    href="/værktøjer/googlecalsync?week={globalWeek}&from=skema"
    class="btn btn-sm pl-1 rounded-full shadow-sm hidden md:inline-flex items-center"
    ><p class="btn btn-xs btn-accent font-black rounded-full">NY!</p>
    synkroniser denne uge med Google Kalender
  </a>
{/if}
