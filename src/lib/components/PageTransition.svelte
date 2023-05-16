<script>
  export let pathname = "";

  function onRouteChange() {
    console.log("%c ROUTE CHANGE => " + pathname, "color: Lightgreen");
    if (!window.location.href.includes("tema")) {
      if (localStorage.getItem("Previewing Theme") == "true") {
        console.log("removing temp theme, reloading");
        localStorage.setItem("Previewing Theme", "false");
        location.reload();
      }
    }
    if (window.location.href.indexOf("betlec.netlify.app") > -1 && window.location.href.indexOf("dev--betlec.netlify.app") == -1) {
      console.log("%c ROUTE NOT PERMITTED", "color: red");
      window.location.href = "https://betterlectio.dk";
    }
    console.log("%c ROUTE PERMITTED", "color: Lightgreen");
  }
</script>

{#key pathname}
  <div use:onRouteChange>
    <slot />
  </div>
{/key}
