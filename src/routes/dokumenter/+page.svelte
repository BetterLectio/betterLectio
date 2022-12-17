<script>
  import Brugernavn from "../../components/Brugernavn.svelte";
  
  import { informationer, dokumenter } from "../../components/store";
  import { get } from "../../components/http";
  import { stringify } from "postcss";
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

  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn = key.split("(")[1].split(" ");
      navn.pop();
      navn = `${key.split("(")[0]}(${navn.join(" ")})`;
      _elever[navn] = value;
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
  });

  get("/dokumenter").then((data) => {
    $dokumenter = data;
  });

  let backFolder = null
  function clickHandler(element) {
    const id = element.srcElement.parentNode.id
    console.log(element.srcElement.parentNode.className)
    if (element.srcElement.parentNode.className.includes("folder")) {
      get("/dokumenter?folderid=" + id).then((data) => {
        $dokumenter = data;
      });
    } else if (id.includes("/res/")) {
      window.open(`https://www.lectio.dk/lectio/${cookie.school}/lc/${id}`)
    } else {
      window.open(`https://www.lectio.dk/lectio/${cookie.school}/dokumenthent.aspx?documentid=${id}`)
    }
  }
</script>

<h1 class="mb-4 text-3xl font-bold">Dokumenter - Work in progress</h1>
{#if $dokumenter}
  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Navn</th>
          <th>Dato</th>
          <th>Ændret af</th>
        </tr>
      </thead>
      <tbody>
        {#each $dokumenter["indhold"] as dokument}
          <tr class="cursor-pointer {dokument["type"]}" on:click={clickHandler} id={dokument["id"]}>
            <td>
              {#if dokument["type"] == "folder"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-yellow-300 p-0" viewBox="0 0 16 16">
                  <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
                </svg>
                {:else if dokument["type"] == "dokument"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
                  <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                </svg>
              {/if}
            </td>
            <td>{dokument["navn"]}</td>
            <td>{(dokument["type"] == "dokument") ? dokument["dato"] : ""}</td>
            <td>{(dokument["type"] == "dokument") ? dokument["ændret_af"] : ""}</td> <!--<Brugernavn navn={dokument.ændret_af} id={$informationer.lærereOgElever[dokument.ændret_af]}/>-->
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

{#if cookie}
  <a
    href="https://www.lectio.dk/lectio/{cookie.school}/DokumentOversigt.aspx?elevid={cookie.userid}"
    class="btn-primary btn">Åben i lectio</a
  >
{:else}
  <p class="mb-4">loading...</p>
{/if}
