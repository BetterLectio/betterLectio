<script defer>
  import { onMount } from "svelte";
  import { get } from "../../components/http.js";
  Date.prototype.getWeekNumber = function () {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  let LastLessonOfDay = getLastLessonOfDay();

  async function getRemainingTime() {
    let coundDownToDate = await LastLessonOfDay;
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();
    let currentSecond = new Date().getSeconds();

    let secondsLeft = coundDownToDate.seconds - currentSecond;
    let minutesLeft = coundDownToDate.minutes - currentMinute;
    let hoursLeft = coundDownToDate.hours - currentHour;
    if (minutesLeft < 0) {
      minutesLeft = 60 + minutesLeft;
      hoursLeft = hoursLeft - 1;
    }
    if (hoursLeft < 0 || minutesLeft < 0 || secondsLeft < 0) {
        return [0, 0, 0];
    }
    return [hoursLeft, minutesLeft, secondsLeft];
  }
  async function getLastLessonOfDay() {
    let week = new Date().getWeekNumber();
    let year = new Date().getFullYear();
    let date = new Date().getDate();
    let monthnr = new Date().getMonth() + 1;
    let filter = `${date}/${monthnr}-${year}`;
    let response = await get(`/skema?uge=${week}&år=${year}`);
    let LastModulOfTheDaytime = "";
    for (let i = 0; i < response.moduler.length; i++) {
      if (response.moduler[i].tidspunkt.includes(filter)) {
        LastModulOfTheDaytime = response.moduler[i].tidspunkt;
      }
    }
    if (LastModulOfTheDaytime == "") {
      return "no lessons today";
    }
    let time = LastModulOfTheDaytime.split(" ")[3];
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let second = "60";
    return {
      hours: hour,
      minutes: minute,
      seconds: second,
    };
  }
  setInterval(async () => {
    const t = await getRemainingTime();
    document.getElementById("counterElementh").style.setProperty("--value", t[0]);
    document.getElementById("counterElementm").style.setProperty("--value", t[1]);
    document.getElementById("counterElements").style.setProperty("--value", t[2]);
    console.log(t);
  }, 1000);
</script>

<div class="grid place-items-center h-screen">
  <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
    <div class="flex flex-col">
      <span class="countdown font-mono text-6xl md:text-9xl">
        <span id="counterElementh" />
      </span>
      Timer
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-6xl md:text-9xl">
        <span id="counterElementm" />
      </span>
      Minutter
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-6xl md:text-9xl">
        <span id="counterElements" />
      </span>
      Sekunder
    </div>
  </div>
</div>
