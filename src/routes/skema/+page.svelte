<!--
  TODO: 
  load more data on week change ✅
  add a loading indicator
  add color to the events

-->
<script>
  import { get } from "../../components/http.js";
  import { skema } from "../../components/store.js";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";

  import { cookieInfo } from "../../components/CookieInfo";
  let cookie;
  cookieInfo().then(data => {
    cookie = data;
  })
  let ec; // to store the calendar instance and access it's methods
  let plugins = [TimeGrid];

  let customTheme = {
    active: "ec-active",
    allDay: "ec-all-day relative",
    bgEvent: "ec-bg-event",
    bgEvents: "ec-bg-events",
    body: "ec-body border border-base-content rounded-b-2xl",
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
    event: "btn btn-xs absolute overflow-hidden text-black border-none hover:shadow-xl ml-0.5 hover:scale-110 z-10 hover:z-0",
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
    week: "ec-week",
    withScroll: "ec-with-scroll",
  };

  let globalWeek = 0;
  let globalYear = 0;
  let addedEventsId = [];

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
    dayHeaderFormat: {weekday: 'long', day: 'numeric', month: 'numeric'},
    buttonText: {today: 'I dag', dayGridMonth: 'måned', listDay: 'list', listWeek: 'list', listMonth: 'list', listYear: 'list', resourceTimeGridDay: 'dag', resourceTimeGridWeek: 'uge', timeGridDay: 'dag', timeGridWeek: 'uge'},
    eventDidMount: (event) => {
      addedEventsId.push(event.event.id);
      event.el.innerHTML = `<a href="/modul?absid=${event.event.id}">${event.el.innerHTML}</a>`;
      getAgenda();
      getAgenda();
    },
    viewDidMount: (view) => {
      let dateObj = new Date(view.currentEnd.toISOString());
      globalYear = dateObj.getFullYear();
      let dayOfYear = 2 + Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      globalWeek = Math.floor(dayOfYear / 7);
      onload();
      getAgenda();
      getAgenda();
    },
  };

  $: if ($skema?.[globalYear + "" + globalWeek]) {
    addSkemaToCalendar($skema[globalYear + "" + globalWeek]);
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
      let isAdded = false;
      for (let i = 0; i < addedEventsId.length; i++) {
        // check if it has been added before
        if (addedEventsId[i] === modulCalenderObj.id) {
          isAdded = true;
        }
      }
      if (isAdded) {
        ec.updateEvent(modulCalenderObj);
      } else {
        ec.addEvent(modulCalenderObj);
      }
    }
    ec.refetchEvents();
  }

  $: if (globalWeek && globalYear) {
    getSkema();
  }

  async function getSkema() {
    if (!$skema) {
      $skema = {};
    }
    await get(`/skema?uge=${globalWeek}&år=${globalYear}`).then((data) => {
      $skema[globalYear + "" + globalWeek] = data;

      options.slotMinTime = (parseInt(Object.values($skema[globalYear + "" + globalWeek].modulTider)[0].split(" - ")[0].split(":")[0] - 1)).toString()
      options.slotMaxTime = (parseInt(Object.values($skema[globalYear + "" + globalWeek].modulTider).slice(-1)[0].split(" - ")[1].split(":")[0]) + 1).toString()
    });
    addButtonsToDagsnoter(globalYear, globalWeek);
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
    for (let i = 0; i < slots.length; i++) {
      i >= 5 && i <= 9 ? slotsFiltered.push(slots[i]) : null;
    }
    // add buttons to slots
    for (let i = 0; i < slotsFiltered.length; i++) {
      let infoobj = $skema[year + "" + week].dagsNoter[i];
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

  let dayOffset = 0;

  $: nextDay = () => {
    dayOffset++;
    // if going from sunday to monday, change week
    if (getCurrentday() == 0) {
      changeWeek("plus");
    }
    getAgenda();
  };

  $: prevDay = () => {
    dayOffset--;
    // if going from sunday to monday, change week
    if (getCurrentday() == 6) {
      changeWeek("minus");
    }
    getAgenda();
  };

  $: resetDay = () => {
    dayOffset = 0;
    // if reseting to current day, change week
    let date = new Date();
    if (getCurrentday() != date.getDay()) {
      changeWeek("reset");
    }
    getAgenda();
  };

  function getCurrentday() {
    let date = new Date();
    let cDay = (date.getDay() + dayOffset - 1) % 7;
    if (cDay < 0) {
      cDay = 7 + cDay;
    }
    return cDay;
  }

  $: getCurrentdayLive = () => {
    let date = new Date();
    let cDay = (date.getDay() + dayOffset - 1) % 7;
    if (cDay < 0) {
      cDay = 7 + cDay;
    }
    return cDay;
  };

  $: MapDayNrToName = (dayNr) => {
    switch (dayNr) {
      case 0:
        return "Mandag";
      case 1:
        return "Tirsdag";
      case 2:
        return "Onsdag";
      case 3:
        return "Torsdag";
      case 4:
        return "Fredag";
      case 5:
        return "Lørdag";
      case 6:
        return "Søndag";
    }
  };
  let dagensModuler = [];

  $: getAgenda = async () => {
    dagensModuler = [];
    let currentWeek = $skema[globalYear + "" + globalWeek];
    let moduler = currentWeek["moduler"];
    moduler.forEach((modul) => {
      let modulTidspunkt = modul["tidspunkt"];
      let modulDato = modulTidspunkt.match(/(\d{1,2}\/\d{1,2}-\d{4})/g)[0];
      modulDato = modulDato.replace("-", "/");
      let split = modulDato.split("/");
      let modulDatoUS = split[1] + "/" + split[0] + "/" + split[2];
      let modulDatoObj = new Date(modulDatoUS);
      if (modulDatoObj.getDay() - 1 == getCurrentday()) {
        dagensModuler.push(modul);
      }
    });
  };

  function colorModul(modul) {
    let modulType = modul["status"];
    switch (modulType) {
      case "aflyst":
        return "btn btn-error mb-4 block h-fit p-2 normal-case";
      case "ændret":
        return "btn btn-success mb-4 block h-fit p-2 normal-case";
      case "normal":
        return "btn btn-info mb-4 block h-fit p-2 normal-case";
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/@event-calendar/build/event-calendar.min.js"></script>
</svelte:head>

<span class="my-2  hidden justify-between md:flex">
  <h1 class="mb-4  text-3xl font-bold ">Skema</h1>

  {#if cookie?.userid}
    <a
      class="btn"
      href={`https://www.lectio.dk/lectio/${cookie.school}/studieplan.aspx?elevid=${cookie.userid}`}
      target="_blank"
    >
      Se studieplan
    </a>
  {/if}
</span>

<div class="hidden md:block">
  <Calendar bind:this={ec} {plugins} {options} />
</div>

<div class="block h-20 w-full md:hidden">
  <div class=" mb-3 flex justify-around rounded-xl bg-base-300 py-4">
    <div class="align btn-group flex justify-center">
      <button class="btn btn-primary btn-sm" on:click={prevDay}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-caret-left-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"
          />
        </svg>
      </button>
      <button class="btn btn-primary btn-sm" on:click={resetDay}> i dag </button>
      <button class="btn btn-primary btn-sm" on:click={nextDay}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-caret-right-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
          />
        </svg>
      </button>
    </div>
    <h1 class="text-xl font-bold ">{MapDayNrToName(getCurrentdayLive())}</h1>
  </div>
  {#if dagensModuler.length > 0}
  <div class="flex flex-col rounded-xl bg-base-300 p-4 py-4 pb-0">
    {#each dagensModuler as modul}
      <a class={colorModul(modul)} href="/modul/?absid={modul['absid']}">
        {#if modul["navn"]}
          {#if modul["andet"]}
            <div class="tooltip flex justify-center" data-tip="Har indhold">
              <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-bookmark-fill ml-4 mt-1"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"
                />
              </svg>
            </div>
          {:else}
            <h1 class="text-xl font-bold">{modul["navn"]} {modul["hold"]}</h1>
          {/if}
        {:else}
          <h1 class="text-xl font-bold">{modul["hold"]}</h1>
        {/if}
        <h1 class="text-sm font-bold">{modul["tidspunkt"]}</h1>
        {#if modul["lokale"]}
          <h1 class="text-sm font-bold">{modul["lokale"]}</h1>
        {/if}
      </a>
    {/each}
  </div>
  {:else}
  <p class="text-center">{MapDayNrToName(getCurrentdayLive())} har ingen moduler</p>
  {/if}
</div>
