<script>
  import { get } from "../../components/http";
  const beskedId = new URLSearchParams(window.location.search).get("id");

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

  let besked;
  get("/besked?id=" + beskedId).then((data) => {
    besked = data;
  });
</script>

<h1 class="mb-4 text-3xl font-bold">Besked - Work in progress</h1>
{#if besked}
  <p>{JSON.stringify(besked)}</p>
{/if}

{#if cookie}
  <a
    href="https://www.lectio.dk/lectio/{cookie.school}/beskeder2.aspx?type=showthread&elevid={cookie.userid}&id={beskedId}"
    class="btn-primary btn">Åben i lectio</a
  >
{:else}
  <p class="mb-4">loading...</p>
{/if}
