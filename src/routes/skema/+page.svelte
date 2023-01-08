<script>
  import { onMount } from "svelte";
  import { get } from "../../components/http";
  import { skema } from "../../components/store";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import DayGrid from "@event-calendar/day-grid";
  import List from "@event-calendar/list";
  import { addNotification } from "../../components/notifyStore";
  addNotification("Skema siden er stadig under udvikling", "alert-warning");

  let ec; // Event Calendar

  let plugins = [TimeGrid, DayGrid, List];
  let options = {
    locale: new Intl.DateTimeFormat("da-DK").resolvedOptions().locale,
    view: "timeGridWeek",
    events: [],
    allDaySlot: false,
    nowIndicator: true,
    firstDay: 1,
    
  };

  function getWeekNumber() {
    var d = new Date(Date.now());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  function getSkema() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeekNr = getWeekNumber();
    console.log(currentYear, currentWeekNr);
  }
  
  onMount(() => {
    getSkema();
  });
</script>

<div class="rounded-lg bg-gray-100 p-4">
  <Calendar bind:this={ec} {plugins} {options} />
</div>
