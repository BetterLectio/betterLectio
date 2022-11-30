<script>
  import { fravaer } from "../../components/store";
  import { get } from "../../components/http";
  const CokieInfo = async () => {
    if (!localStorage.getItem("authentication")) {
      console.log("Redirect");
      window.location.href = "/auth";
    } else {
      let decodedCookie = atob(localStorage.getItem("authentication"));
      cookie = JSON.parse(decodedCookie);
      return {
        user: cookie["LastLoginUserName"],
        school: cookie["LastLoginExamno"],
        userid: cookie["LastLoginElevId"],
      };
    }
  };
  let cookie;
  CokieInfo().then((data) => {
    cookie = data;
  });
  let samletFravaer = null;
  get("/fravaer").then((data) => {
    $fravaer = data;
    $fravaer.generalt.forEach((element) => {
      if (element.hold == "Samlet") {
        samletFravaer = parseFloat(element.fravær_procent);
      }
    });
  });
</script>

<h1 class="mb-4 text-3xl font-bold">Fravær - Work in progress</h1>
{#if $fravaer}
  {#if samletFravaer == 0}
    <p>Du har intet fravær</p>
  {:else}
    <p>{JSON.stringify(samletFravaer)}%</p>
  {/if}
{/if}

{#if cookie}
  <a
    href="https://www.lectio.dk/lectio/681/subnav/fravaerelev.aspx?elevid={cookie.userid}"
    class="btn-primary btn">Åben i lectio</a
  >
{:else}
  <p class="mb-4">loading...</p>
{/if}
