<script>
  import { informationer, beskeder } from "../../components/store.js";
  /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
  import { get } from "../../components/http.js";
  let ready = false;
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

  $: if ($beskeder && $informationer) {
    ready = true;
  }

  function changeCategory(id = null) {
    if (typeof id == "string") {
      get(`/beskeder?id=${id}`).then((data) => {
        currentId = id;
        $beskeder[id] = data;
      });
    }
  }

  let alreadyLoaded = [];
  let loadedIndex = {};
  function loadImage(element) {
    if (!alreadyLoaded.includes(element.id)) {
      alreadyLoaded.push(element.id);
      //console.log(element.id);
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob"; //so you can access the response like a normal URL
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          let src = URL.createObjectURL(xhr.response);
          element.outerHTML = `<img id="${element.id}" src="${src}" class="object-cover w-14 h-14 rounded-full"/>`;
          loadedIndex[element.id] = src;
        }
      };
      xhr.open(
        "GET",
        `https://better-lectio-flask-backend.vercel.app/profil_billed?id=${element.id}&fullsize=1`,
        true
      );
      xhr.setRequestHeader("lectio-cookie", localStorage.getItem("authentication"));
      xhr.send();
    } else {
      useLoadedImage(element);
    }
  }
  async function useLoadedImage(element) {
    while (true) {
      if (loadImage[element.id] == undefined) {
        //console.log("undefined", typeof loadedIndex[element.id]);
      } else {
        //console.log("UNDEUNDEUND");
        element.outerHTML = `<img id="${element.id}" src="${
          loadImage[element.id]
        }" class="object-cover w-14 h-14 rounded-full"/>`;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
</script>

<body>
  <h1 class="mb-4 text-3xl font-bold">Beskeder</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#if ready}
    <div class="btn-group z-20 mb-4 w-full">
      {#each $beskeder[currentId].besked_muligheder as beskedMulighed}
        <btn
          class={beskedMulighed.id == currentId ? "btn-primary btn" : "btn"}
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
                <div
                  id={$informationer.lærereOgElever[besked.førsteBesked]}
                  class="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
                  use:loadImage
                >
                  <span class="font-medium text-gray-600 dark:text-gray-300">{besked.førsteBesked[0]}</span>
                </div>
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
                <div class="flex -space-x-4">
                  <!-- Place holder billeder for modtagere af beskeden-->
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
              </div>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</body>
