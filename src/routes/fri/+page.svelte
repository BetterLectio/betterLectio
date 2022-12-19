<script defer>
  import { get } from "../../components/http.js";

  let counterIsVisible = true;

  Date.prototype.getWeekNumber = function () {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  async function getRemainingTime() {
    let lastLesson = await getLastLessonOfDay();
    let secondsLeft = lastLesson.seconds - new Date().getSeconds();
    let minutesLeft = lastLesson.minutes - new Date().getMinutes();
    let hoursLeft = lastLesson.hours - new Date().getHours();
    if (minutesLeft < 0) {
      minutesLeft = 60 + minutesLeft;
      hoursLeft = hoursLeft - 1;
    }
    if (hoursLeft < 0 || minutesLeft < 0 || secondsLeft < 0) {
      const counterel = document.getElementById("counter");
      counterel.parentNode.removeChild(counterel);
      const friel = document.getElementById("fri");
      friel.classList.remove("hidden");
      counterIsVisible = false;
    } else if (lastLesson == "no lessons today") {
      const counterel = document.getElementById("counter");
      counterel.parentNode.removeChild(counterel);
      const ingentimerel = document.getElementById("ingentimer");
      ingentimerel.classList.remove("hidden");
      counterIsVisible = false;
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
      if (response.moduler[i].status != "aflyst") {
        if (response.moduler[i].tidspunkt.includes(filter)) {
          LastModulOfTheDaytime = response.moduler[i].tidspunkt;
        }
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
    if (counterIsVisible) {
      const t = await getRemainingTime();
      document.getElementById("counterElementh").style.setProperty("--value", t[0]);
      document.getElementById("counterElementm").style.setProperty("--value", t[1]);
      document.getElementById("counterElements").style.setProperty("--value", t[2]);
    }
  }, 1000);
</script>

<div class="grid h-screen place-items-center">
  <div class="grid auto-cols-max grid-flow-col gap-5 text-center" id="counter">
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
  <p class="hidden font-mono text-6xl font-bold lg:text-9xl" id="fri">Du har fri!</p>
  <p class="hidden font-mono text-2xl font-bold lg:text-4xl" id="ingentimer">Du har ingen timer i dag!</p>
</div>
