<script>
  import { fly } from "svelte/transition";

  import { informationer, dokumenter } from "$lib/js/store";
  import { get } from "$lib/js/http";

  import { cookieInfo } from "$lib/js/CookieInfo";
  import { onMount } from "svelte";
  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });

  let lastClickedFolder = null;
  $: breadcrumbs = [{ id: "..", navn: "/" }];
  $: computedBreadcrumbs = breadcrumbs;
  $: exploreArr = [];
  $: selectedFolderId = null;

  get("/informationer").then((data) => {
    $informationer = data;
    let _elever = {};
    for (const [key, value] of Object.entries($informationer.elever)) {
      let navn;
      try {
        navn = key.split("(")[1].split(" ");
        navn.pop();
        navn = `${key.split("(")[0]}(${navn.join(" ")})`;
        _elever[navn] = value;
      } catch (error) {
        _elever[key] = value;
        console.warn("Couldn't parse navn for elev", key);
      }
    }
    $informationer.lærereOgElever = { ...$informationer.lærere, ..._elever };
  });

  let loading = true;
  let loadingStarted = Date.now();
  get("/dokumenter").then((data) => {
    $dokumenter = data;
    calcExploreArr(data, "..");
    loading = false;
    loadingStarted = Date.now();
  });

  async function clickHandler(element) {
    const id = element.srcElement.parentNode.id;

    //if ((await element.srcElement.parentNode.className.indexOf("breadcrumb")) > -1) {
    //  breadcrumbs = [];
    //  let done = false;
    //  await computedBreadcrumbs.forEach((item, index) => {
    //    if (!done) {
    //      breadcrumbs.push(item);
    //      if (item.id == element.srcElement.parentNode.id) {
    //        done = true;
    //      }
    //    }
    //  });
    //} else if (element.srcElement.parentNode.children[1].innerText != "..") {
    //  lastClickedFolder = {
    //    id: id,
    //    navn: element.srcElement.parentNode.children[1].innerText,
    //  };
    //  // before pushing the last clicked folder, check if it's already in the breadcrumbs
    //  if (breadcrumbs[breadcrumbs.length - 1].id != lastClickedFolder.id) {
    //    // before pushing the last clicked folder, check if it has the class "folder" (if it doesn't, it's a file and shouldn't be added to the breadcrumbs)
    //    if ((await element.srcElement.parentNode.className.indexOf("folder")) > -1) {
    //      await breadcrumbs.push(lastClickedFolder);
    //    }
    //  }
    //} else {
    //  await breadcrumbs.pop();
    //}
    //// update the breadcrumbs in the html
    //computedBreadcrumbs = breadcrumbs;
    if ((await element.srcElement.parentNode.className.indexOf("folder")) > -1) {
      // same as .includes("folder") but works in all browsers
      loading = true;
      loadingStarted = Date.now();
      if (id == "..") {
        await get("/dokumenter").then((data) => {
          $dokumenter = data;
          calcExploreArr(data, id);
        });
      } else {
        await get("/dokumenter?folderid=" + id).then((data) => {
          $dokumenter = data;
          calcExploreArr(data, id);
        });
      }
      loading = false;
    } else if (id.includes("/res/")) {
      await window.open(`https://www.lectio.dk/lectio/${cookie.school}/lc/${id}`);
    } else {
      await window.open(`https://www.lectio.dk/lectio/${cookie.school}/dokumenthent.aspx?documentid=${id}`);
    }
  }

  let now = Date.now();
  onMount(async () => {
    const interval = setInterval(() => {
      now = new Date();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  function calcExploreArr(data, id) {
    selectedFolderId = id;
    console.log("selectedFolderId", id);
    let dataBefore = data.indhold;
    let dataAfter = [];
    dataBefore.forEach((item) => {
      if (item.type == "folder" && item.navn != "..") {
        dataAfter.unshift({
          id: item.id,
          navn: item.navn,
          type: item.type,
          depth: 0,
          parent: id,
          isArrowDown: false,
          isSelected: false, //not implemented yet
        });
      }
    });
    if (!exploreArr[0]) {
      exploreArr = dataAfter;
      return;
    }
    if (id == "..") {
      exploreArr = dataAfter;
      return;
    }
    //if the array is not empty, match the id and append the new folders to the array under the parent folder with the correct depth
    exploreArr.forEach((item) => {
      if (item.id == id) {
        dataAfter.forEach((item2) => {
          //before adding the new folders, check if they already exist in the array
          let exists = false;
          exploreArr.forEach((item3) => {
            if (item3.id == item2.id) {
              exists = true;
            }
          });
          if (exists) {
            return;
          }
          item2.depth = item.depth + 1;
          exploreArr.splice(exploreArr.indexOf(item) + 1, 0, item2);
          exploreArr = [...exploreArr];
        });
      }
    });
    exploreArr.forEach((item) => {
      if (item.id == id) {
        item.isArrowDown = true;
      }
    });

    //if the array has content already, find the id of the parent folder and add the new folders to the array under the parent folder with the correct depth
    console.log("exploreArr", exploreArr);
  }

  function handleExploreClick(id) {
    exploreArr.forEach((item) => {
      if (item.id == id) {
        item.isArrowDown = !item.isArrowDown;
        //if the arrow is pointing up, remove all the folders under the parent folder with a higher depth
        if (!item.isArrowDown) {
          for (let i = exploreArr.indexOf(item) + 1; i < exploreArr.length; i++) {
            if (exploreArr[i].depth > item.depth) {
              exploreArr.splice(i, 1);
              i--;
            } else {
              break;
            }
          }
        } else {
          if (item.type == "folder") {
            loading = true;
            get("/dokumenter?folderid=" + id).then((data) => {
              calcExploreArr(data, id);
              // in the future, add bredcrum to the exploreArr but im too lazy to do it now :))
              $dokumenter = data;
              loading = false;
            });
          }
        }
      }
    });
    exploreArr = [...exploreArr];
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css" />
</svelte:head>

<h1 class="heading">Dokumenter</h1>

<!-- breadcrumbs diasbled for now to avoid confusion 
  <div class="breadcrumbs text-sm">
    <ul>
      {#each computedBreadcrumbs as crumb}
        <li class="folder breadcrumb" id={crumb.id} in:fly={{ x: -30, duration: 200 }}>
          <button on:click={clickHandler}>{crumb.navn}</button>
        </li>
      {/each}
    </ul>
  </div>
-->

{#if $dokumenter}
  <div class="overflow-x-auto flex">
    <div class="h-full w-60 mr-2 hidden lg:inline">
      {#each exploreArr as item}
        <div
          class="flex flex-row items-center cursor-pointer hover:bg-base-300 rounded-md {'ml-' + item.depth * 2}"
          on:click={() => handleExploreClick(item.id)}
        >
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill mr-1 {item.isArrowDown ? "rotate-90" : ""}" viewBox="0 0 16 16"><path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg>
          <p>{item.navn}</p>
        </div>
      {/each}
    </div>
    <div class="divider divider-horizontal" />
    <div class="w-full h-fit">
      <h2 class="text-2xl ml-3 font-bold">{selectedFolderId == ".." ? "Dokument Oversigt" : $dokumenter["titel"]}</h2>
      <table class="table-zebra mb-4 table w-full h-fit">
        <!-- head -->
        <thead>
          <tr>
            <th />
            <th>Navn</th>
            {#if window.innerWidth > 768}
              <th>Dato</th>
              <th>Ændret af</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#if loading && now - loadingStarted >= 100}
            <!--loop 3 times-->
            {#each [1, 2, 3] as i}
              <tr class="animate-pulse">
                <td><div class="h-[33.609px] w-6 rounded-md bg-base-300" /></td>
                <td><div class="h-[33.609px] w-36 rounded-md bg-base-300" /></td>
                {#if window.innerWidth > 768}
                  <td><div class="h-[33.609px] w-36 rounded-md bg-base-300" /></td>
                  <td><div class="h-[33.609px] w-36 rounded-md bg-base-300" /></td>
                {/if}
              </tr>
            {/each}
          {:else}
            {#each $dokumenter["indhold"] as dokument}
              <tr class="hover cursor-pointer {dokument['type']}" on:click={clickHandler} id={dokument["id"]}>
                <td>
                  {#if dokument["type"] == "folder"}
                    <i style="font-size: 1.4rem;" class="bi bi-folder-fill text-yellow-300" />
                  {:else if dokument["type"] == "dokument"}
                    <i style="font-size: 1.4rem;" class="bi-file-earmark bi-filetype-{dokument['navn'].split('.').slice(-1)}" />
                    <!-- bi-file-earmark er fallback hvis filtypen ikke har et icon-->
                  {/if}
                </td>
                <td>{dokument["navn"]}</td>
                {#if window.innerWidth > 768}
                  <td>{dokument["type"] == "dokument" ? dokument["dato"] : ""}</td>
                  <td>{dokument["type"] == "dokument" ? (dokument["ændret_af"] == "ukendt" ? "" : dokument["ændret_af"]) : ""}</td>
                {/if}
                <!--<Brugernavn navn={dokument.ændret_af} id={$informationer.lærereOgElever[dokument.ændret_af]}/>-->
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{/if}
