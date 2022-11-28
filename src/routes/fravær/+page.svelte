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
        userid: cookie["LastLoginElevId"]
      }
    }
  };
  let cookie;
  CokieInfo().then((data) => {
    cookie = data;
  });
  get("/fravaer").then((data) => {
    $fravaer = (data);
  });

</script>

<h1 class="mb-4 text-3xl font-bold">Fravær - Work in progress</h1>
{#if $fravaer}
  <p>{JSON.stringify($fravaer)}</p>
{/if}

{#if cookie}
  <a href="https://www.lectio.dk/lectio/681/subnav/fravaerelev.aspx?elevid={cookie.userid}" class="btn btn-primary">Åben i lectio</a>
{:else}
  <p class="mb-4">loading...</p>
{/if}

  


