<script>
  import { dokumenter } from "../../components/store";
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
  get("/dokumenter").then((data) => {
    $dokumenter = data;
  });
</script>

<h1 class="mb-4 text-3xl font-bold">Dokumenter - Work in progress</h1>
{#if $dokumenter}
  <p>{JSON.stringify($dokumenter)}</p>
{/if}

{#if cookie}
  <a
    href="https://www.lectio.dk/lectio/{cookie.school}/DokumentOversigt.aspx?elevid={cookie.userid}"
    class="btn-primary btn">Åben i lectio</a
  >
{:else}
  <p class="mb-4">loading...</p>
{/if}
