<script>
  import mixpanel from "mixpanel-browser";

  export let pathname = "";

  function onRouteChange() {
    console.info("%c Route change started => " + pathname, "color: Lightgreen");
    if (!window.location.href.includes("tema")) {
      if (localStorage.getItem("Previewing Theme") == "true") {
        console.log("removing temp theme, reloading");
        localStorage.setItem("Previewing Theme", "false");
        location.reload();
      }
    }
    /* Tror ikke det er nødvendigt længere
    if (window.location.href.indexOf("betlec.netlify.app") > -1 && window.location.href.indexOf("dev--betlec.netlify.app") == -1) {
      console.warn("%c ROUTE NOT PERMITTED", "color: red");
      window.location.href = "https://betterlectio.dk";
    }*/
  }

  import { navigating } from "$app/stores";

  let previous;
  let start;
  let end;

  $: if ($navigating) {
    start = Date.now();
    end = null;
    previous = $navigating;
  } else {
    end = Date.now();
  }

  $: if (previous && end) {
    mixpanel.track(`on ${pathname}`, { page: pathname });
    if (end - start > 100) {
      console.log(`%c Route change (${pathname}) in ${end - start}ms`, "color: Yellow; font-weight: bold");
    } else {
      console.log(`%c Route change (${pathname}) in ${end - start}ms`, "color: Lightgreen; font-weight: bold");
    }
  }
</script>

{#key pathname}
  <div use:onRouteChange>
    <slot />
  </div>
{/key}
