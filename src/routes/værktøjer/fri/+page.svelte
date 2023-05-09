<script defer>
  import { cookieInfo } from "$lib/js/CookieInfo";
  import { get } from "$lib/js/http.js";
  import moment from "moment";
  import Spinner from "$lib/components/Spinner.svelte";

  let counterIsVisible = true;
  const timeRegex =
    /((?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til ((?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/m;

  let id;

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
    if (id == null) {
      id = "S" + cookie.userid;
    }
  });

  Date.prototype.getWeekNumber = function () {
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  let lastLesson = null;
  async function hasId() {
    if (id == null) {
      setTimeout(hasId, 50);
      return;
    }
    lastLesson = await getLastLessonOfDay();
  }
  (async () => {
    await hasId();
  })();

  async function getRemainingTime() {
    if (lastLesson == "no lessons today") {
      const counterel = document.getElementById("counter");
      counterel.parentNode.removeChild(counterel);
      const ingentimerel = document.getElementById("ingentimer");
      ingentimerel.classList.remove("hidden");
      counterIsVisible = false;
      return null;
    }

    const now = moment();
    const duration = moment.duration(lastLesson.time.diff(now));
    let secondsLeft = duration.seconds();
    let minutesLeft = duration.minutes();
    let hoursLeft = duration.hours();
    if (now.isAfter(lastLesson.time)) {
      const counterel = document.getElementById("counter");
      counterel.parentNode.removeChild(counterel);
      const friel = document.getElementById("fri");
      friel.classList.remove("hidden");
      counterIsVisible = false;
      return null;
    }
    return [hoursLeft, minutesLeft, secondsLeft];
  }

  function nameBlacklisted(name) {
    // TODO: Check notes for "frivillig" string (very rare)
    if (name == null) {
      return false;
    }
    name = name.toLowerCase();

    if (["obligatorisk"].some((x) => name.includes(x))) {
      return false;
    }
    if (["café", "cafe", "klub", "club", "fri", "konkurrence", "mesterskab", "workshop", "kemi ol"].some((x) => name.includes(x))) {
      return true;
    }
    return false;
  }

  async function getLastLessonOfDay() {
    let week = new Date().getWeekNumber();
    let year = new Date().getFullYear();
    let date = new Date().getDate();
    let monthnr = new Date().getMonth() + 1;
    let filter = `${date}/${monthnr}-${year}`;
    let response = await get(`/skema?id=${id}&uge=${week}&år=${year}`);
    let LastModulOfTheDaytime = "";
    for (let i = 0; i < response.moduler.length; i++) {
      if (response.moduler[i].status != "aflyst") {
        if (!nameBlacklisted(response.moduler[i].navn)) {
          if (response.moduler[i].tidspunkt.includes(filter)) {
            LastModulOfTheDaytime = response.moduler[i].tidspunkt;
          }
        }
      }
    }
    if (LastModulOfTheDaytime == "") {
      return "no lessons today";
    }
    const time = timeRegex.exec(LastModulOfTheDaytime);
    const moment_time = moment(`${time[1]} ${time[3]}`, "D/M-YYYY HH:mm");
    return {
      time: moment_time,
    };
  }

  setInterval(async () => {
    if (lastLesson != null && counterIsVisible) {
      const t = await getRemainingTime();
      if (t == null) {
        clearInterval(this);
        return;
      }
      document.getElementById("counterElementh").style.setProperty("--value", t[0]);
      document.getElementById("counterElementm").style.setProperty("--value", t[1]);
      document.getElementById("counterElements").style.setProperty("--value", t[2]);
    }
  }, 1000);
</script>

<div class="grid h-screen place-items-center">
  {#if lastLesson}
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
  {:else}
    <Spinner />
  {/if}
</div>
