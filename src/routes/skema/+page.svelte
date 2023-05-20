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

  $fag ??= {};

  $: skemaId = new URLSearchParams(window.location.search).get("id");

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
    if (skemaId == null) {
      skemaId = "S" + cookie.userid;
      window.history.pushState({}, null, "/skema?id=" + skemaId);
    }
  });
  let ec; // to store the calendar instance and access it's methods
  let plugins = [TimeGrid];

  let customTheme = {
    active: "ec-active",
    allDay: "ec-all-day relative -mt-4 md:mt-0",
    bgEvent: "ec-bg-event",
    bgEvents: "ec-bg-events",
    body: "ec-body border border-base-content rounded-b-2xl",
    button: "btn btn-primary btn-sm ONCHANGE visible",
    buttonGroup: "btn-group visible",
    calendar: "ec-calendar",
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
      "btn btn-xs absolute flex-nowrap w-full h-full overflow-hidden text-black hover:shadow-xl visible hover:scale-110 z-10 hover:z-0 border-0 m-0.5 hover:brightness-90",
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
      "flex items-center ec-toolbar bg-secondary text-secondary-content md:text-base-content md:bg-base-100 p-2 rounded-t-2xl -mt-8 md:mt-0 border border-base-content md:border-0",
    uniform: "ec-uniform",
    week: "ec-week",
    withScroll: "ec-with-scroll",
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
        event.el.classList.add("after:content-['_📖']", "after:px-1", "hover:after:content-['_📖']", "text-left", "justify-between");
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
      if (modul["hold_id"] != null && $fag[modul["hold_id"]] == undefined) {
        let _fag = await HoldOversætterNy(modul["hold_id"]);
        $fag[modul["hold_id"]] = _fag == "Andet" ? modul["hold"] : _fag;
      }
      if (modul["navn"] != undefined) {
        titel = modul["navn"] != null && modul["navn"] != "Ændret!" ? modul["navn"] : $fag[modul["hold_id"]];
        if (modul["lokale"]) {
          titel += " · " + modul["lokale"].split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)[0];
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
      let status = modul["status"]; // can be "normal" "ændret" or "aflyst"
      let className;
      if (status == "normal" || status == "ændret") {
        if (holdToColor[modul.hold] && $indstillinger.skema.classesWithDiffrentColors == true) {
          className = `hsl(${holdToColor[modul.hold]}, 75%, 65%)`;
        } else {
          className = "hsl(var(--in))";
        }
      } else {
        className = "hsl(var(--er))";
      }
      let hasContent = modul["andet"] == null ? false : true;
      //const backgroundColor = $indstillinger?.classesWithDiffrentColors === true ? className : stringToHex(modul["hold"]);

      let modulCalenderObj = {
        title: titel,
        start: new Date(`${start.år}-${start.måned}-${start.dag}T${start.tidspunkt}`),
        end: new Date(`${slut.år}-${slut.måned}-${slut.dag}T${slut.tidspunkt}`),
        id: modul["absid"],
        backgroundColor: className,
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

  async function getSkema() {
    if (!skema) {
      skema = {};
    }
    await get(`/skema?id=${skemaId}&uge=${globalWeek}&år=${globalYear}`).then((data) => {
      skema[globalYear + "" + globalWeek] = data;
      heading = skema?.[globalYear + "" + globalWeek]?.overskrift || "skema";

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
  //function stringToHex(string) {
  //  var hash = 0;
  //  if (string.length === 0) return hash;
  //  for (var i = 0; i < string.length; i++) {
  //    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  //    hash = hash & hash;
  //  }
  //  var color = "#";
  //  for (var i = 0; i < 3; i++) {
  //    var value = (hash >> (i * 8)) & 255;
  //    color += ("00" + value.toString(16)).substr(-2);
  //  }
  //  return color;
  //}

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

  //let dayOffset = 0;

  //$: nextDay = () => {
  //  dayOffset++;
  //  // if going from sunday to monday, change week
  //  if (getCurrentday() == 0) {
  //    changeWeek("plus");
  //  }
  //  getAgenda();
  //};

  //$: prevDay = () => {
  //  dayOffset--;
  //  // if going from sunday to monday, change week
  //  if (getCurrentday() == 6) {
  //    changeWeek("minus");
  //  }
  //  getAgenda();
  //};

  //$: resetDay = () => {
  //  dayOffset = 0;
  //  // if reseting to current day, change week
  //  let date = new Date();
  //  if (getCurrentday() != date.getDay()) {
  //    changeWeek("reset");
  //  }
  //  getAgenda();
  //};

  //function getCurrentday() {
  //  let date = new Date();
  //  let cDay = (date.getDay() + dayOffset - 1) % 7;
  //  if (cDay < 0) {
  //    cDay = 7 + cDay;
  //  }
  //  return cDay;
  //}

  //$: getCurrentdayLive = () => {
  //  let date = new Date();
  //  let cDay = (date.getDay() + dayOffset - 1) % 7;
  //  if (cDay < 0) {
  //    cDay = 7 + cDay;
  //  }
  //  return cDay;
  //};

  //$: MapDayNrToName = (dayNr) => {
  //  switch (dayNr) {
  //    case 0:
  //      return "Mandag";
  //    case 1:
  //      return "Tirsdag";
  //    case 2:
  //      return "Onsdag";
  //    case 3:
  //      return "Torsdag";
  //    case 4:
  //      return "Fredag";
  //    case 5:
  //      return "Lørdag";
  //    case 6:
  //      return "Søndag";
  //  }
  //};
  //let dagensModuler = [];

  //$: getAgenda = async () => {
  //  dagensModuler = [];
  //  let currentWeek = skema[globalYear + "" + globalWeek];
  //  let moduler = currentWeek["moduler"];
  //  moduler.forEach((modul) => {
  //    let modulTidspunkt = modul["tidspunkt"];
  //    let modulDato = modulTidspunkt.match(/(\d{1,2}\/\d{1,2}-\d{4})/g)[0];
  //    modulDato = modulDato.replace("-", "/");
  //    let split = modulDato.split("/");
  //    let modulDatoUS = split[1] + "/" + split[0] + "/" + split[2];
  //    let modulDatoObj = new Date(modulDatoUS);
  //    if (modulDatoObj.getDay() - 1 == getCurrentday()) {
  //      dagensModuler.push(modul);
  //    }
  //  });
  //};

  //function colorModul(modul) {
  //  let modulType = modul["status"];
  //  switch (modulType) {
  //    case "aflyst":
  //      return "btn btn-error mb-4 block h-fit p-2 normal-case";
  //    case "ændret":
  //      return "btn btn-success mb-4 block h-fit p-2 normal-case";
  //    case "normal":
  //      return "btn btn-info mb-4 block h-fit p-2 normal-case";
  //  }
  //}
</script>

<span class="my-2 flex justify-between">
  <h1 class="heading">{heading}</h1>

  {#if cookie?.userid}
    <a
      data-sveltekit-preload-data
      class="btn hidden md:flex"
      href={`https://www.lectio.dk/lectio/${cookie.school}/studieplan.aspx?elevid=${cookie.userid}`}
      target="_blank"
    >
      Se studieplan
    </a>
  {/if}
</span>

<div>
  <Calendar bind:this={ec} {plugins} {options} />
</div>

<!--
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
-->
