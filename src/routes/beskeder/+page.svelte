<script>
  import { informationer, beskeder } from "../../components/store.js";
  import Avatar from "../../components/Avatar.svelte";

  /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
  import { get } from "../../components/http.js";
  let currentId = -70;

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

  get("/beskeder").then((data) => {
    if (!$beskeder) {
      $beskeder = {};
    }
    $beskeder[currentId] = data;
  });

  function changeCategory(id = null) {
    if (typeof id == "string") {
      get(`/beskeder?id=${id}`).then((data) => {
        currentId = id;
        $beskeder[id] = data;
      });
    }
  }
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
</script>

<body>
  <span class="m-2 flex justify-between">
    <h1 class="text-3xl font-bold">beskeder</h1>
    {#if cookie?.userid}
      <a
        class="btn"
        href={`https://www.lectio.dk/lectio/681/beskeder2.aspx?type=nybesked&elevid=${cookie.userid}`}
      >
        Skriv besked
      </a>
    {/if}
  </span>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#if $beskeder?.[currentId]}
    <div class="btn-group z-20 mb-4 w-full">
      {#each $beskeder[currentId].besked_muligheder as beskedMulighed}
        <btn
          class={beskedMulighed.id == currentId ? "btn btn-primary" : "btn"}
          on:click={() => changeCategory(beskedMulighed.id)}>{beskedMulighed.name}</btn
        >
      {/each}
    </div>

    <ul class="menu rounded-box z-10 w-full bg-base-100 p-2 drop-shadow-xl">
      {#each $beskeder[currentId].beskeder as besked}
        <li>
          <a class="block" href="/besked?id={besked.message_id}">
            <div class="flex justify-between">
              <div class="flex items-center">
                <!-- svelte-ignore a11y-missing-attribute -->

                {#if $informationer?.lærereOgElever?.[besked.førsteBesked]}
                  <Avatar
                    id={$informationer.lærereOgElever[besked.førsteBesked]}
                    navn={besked.førsteBesked}
                  />
                {/if}
                <div class="ml-5">
                  <p part="emne" class="text-lg font-bold">
                    {besked.emne}
                  </p>
                  <p part="afsender">
                    {besked.førsteBesked} · {besked.ændret}
                  </p>
                </div>
              </div>
              <div class="right-1 flex items-center">
                <!-- 
                Midlertidig fjernelse af modtagere
                <div class="flex -space-x-4">
                  <img
                    class="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                    src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png"
                    alt=""
                  />
                  <img
                    class="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                    src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png"
                    alt=""
                  />
                  <img
                    class="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                    src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png"
                    alt=""
                  />
                  <a
                    class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
                    href="#">+99</a
                  >
                </div>
              </div> -->
              </div>
            </div></a
          >
        </li>
      {/each}
    </ul>
  {/if}
</body>
