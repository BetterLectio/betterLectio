<script>
  import { fly } from 'svelte/transition';

  import { informationer, dokumenter } from "../../components/store";
  import { get } from "../../components/http";

  import { cookieInfo } from "../../components/CookieInfo";
  import { onMount } from 'svelte';
  let cookie;
  cookieInfo().then(data => {
    cookie = data;
  })

  let lastClickedFolder = null;
  $: breadcrumbs = [{ id: "..", navn: "/" }];
  $: computedBreadcrumbs = breadcrumbs;

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


  let loading = true;
  let loadingStarted = Date.now();
  get("/dokumenter").then((data) => {
    $dokumenter = data;
    loading = false;
    loadingStarted = Date.now();
  });

  async function clickHandler(element) {
    const id = element.srcElement.parentNode.id;
    
    if (await element.srcElement.parentNode.className.indexOf("breadcrumb") > -1) {
      breadcrumbs = [];
      let done = false;
      await computedBreadcrumbs.forEach((item, index) => {
        if (!done) {
          breadcrumbs.push(item);
          if (item.id == element.srcElement.parentNode.id) {
            done = true;
          }
        }
      })
    } else if (element.srcElement.parentNode.children[1].innerText != "..") {
      lastClickedFolder = {
        id: id,
        navn: element.srcElement.parentNode.children[1].innerText,
      };
      // before pushing the last clicked folder, check if it's already in the breadcrumbs
      if (breadcrumbs[breadcrumbs.length - 1].id != lastClickedFolder.id) {
        // before pushing the last clicked folder, check if it has the class "folder" (if it doesn't, it's a file and shouldn't be added to the breadcrumbs)
        if (await element.srcElement.parentNode.className.indexOf("folder") > -1) {
          await breadcrumbs.push(lastClickedFolder);
        }
      }
    } else {
      await breadcrumbs.pop();
    }
    // update the breadcrumbs in the html
    computedBreadcrumbs = breadcrumbs;
    if (await element.srcElement.parentNode.className.indexOf("folder") > -1) {
      // same as .includes("folder") but works in all browsers
      loading = true;
      loadingStarted = Date.now();
      if (id == "..") {
        await get("/dokumenter").then((data) => {
          $dokumenter = data;
        });
      } else {
        await get("/dokumenter?folderid=" + id).then((data) => {
          $dokumenter = data;
        });
      }
      loading = false;
    } else if (id.includes("/res/")) {
      await window.open(`https://www.lectio.dk/lectio/${cookie.school}/lc/${id}`);
    } else {
      await window.open(`https://www.lectio.dk/lectio/${cookie.school}/dokumenthent.aspx?documentid=${id}`);
    }
  }

  let now = Date.now()
  onMount(async () => {
    const interval = setInterval(() => {
			now = new Date();
		}, 100);

		return () => {
			clearInterval(interval);
		};
  })

</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
</svelte:head>

<h1 class="mb-4 text-3xl font-bold">Dokumenter</h1>

<div class="breadcrumbs text-sm">
  <ul>
    {#each computedBreadcrumbs as crumb (crumb.id)}
      <li class="folder breadcrumb" id={crumb.id} in:fly="{{ x: -30, duration: 200}}" out:fly="{{ x: 30, duration: 200}}">
        <button on:click={clickHandler}>{crumb.navn}</button>
      </li>
    {/each}
  </ul>
</div>

{#if $dokumenter}
  <div class="overflow-x-auto">
    <table class="table-zebra mb-4 table w-full">
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
        {#if loading && now-loadingStarted >= 100}
          <tr class="animate-pulse">
            <td><div class="w-6 bg-gray-300 h-6 rounded-md"></div></td>
            <td><div class="w-36 bg-gray-300 h-6 rounded-md"></div></td>
            {#if window.innerWidth > 768}
              <td><div class="w-36 bg-gray-300 h-6 rounded-md"></div></td>
              <td><div class="w-36 bg-gray-300 h-6 rounded-md"></div></td>
            {/if}
          </tr>
        {:else}
          {#each $dokumenter["indhold"] as dokument}
            <tr class="hover cursor-pointer {dokument['type']}" on:click={clickHandler} id={dokument["id"]}>
              <td>
                {#if dokument["type"] == "folder"}
                  <i style="font-size: 1.4rem;" class="bi bi-folder-fill text-yellow-300"></i>
                {:else if dokument["type"] == "dokument"}
                  <i style="font-size: 1.4rem;" class="bi-file-earmark bi-filetype-{dokument["navn"].split(".").slice(-1)}"></i> <!-- bi-file-earmark er fallback hvis filtypen ikke har et icon-->
                {/if}
              </td>
              <td>{dokument["navn"]}</td>
              {#if window.innerWidth > 768}
                <td>{dokument["type"] == "dokument" ? dokument["dato"] : ""}</td>
                <td>{dokument["type"] == "dokument" ? (dokument["ændret_af"] == "ukendt") ? "" : dokument["ændret_af"] : ""}</td>
              {/if}
              <!--<Brugernavn navn={dokument.ændret_af} id={$informationer.lærereOgElever[dokument.ændret_af]}/>-->
            </tr>
          {/each}
        {/if}        
      </tbody>
    </table>
  </div>
{/if}