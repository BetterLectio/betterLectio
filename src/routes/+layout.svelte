<script>
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";
  import "../app.css";
  import PageTransition from "../components/PageTransition.svelte";
  import { brugeren } from "../components/store.js";
  import Avatar from "../components/Avatar.svelte";
  export let data;

  onMount(() => {
    themeChange(false);
  });
  import ThemeSelect from "../components/theme-select.svelte";
  let authed = false;
  async function checkIfAuthed() {
    if (localStorage.getItem("authentication") == null) {
    } else {
      // Dette neden under er udkomenteret da man automatisk vil blive bedt om at logge ind på /forside hvis cookien ikke virker
      //const response = await fetch(
      //    `https://better-lectio-flask-backend.vercel.app/check-cookie?cookie=${localStorage.getItem("authentication")}`
      //);
      //let jsonRes = await response.json();
      //if (jsonRes["valid"] == true) {
      authed = true;
      //}
    }
  }
  function removeLoader() {
    let loader = document.querySelector(".loader");
    console.log(loader);
    loader.style.display = "none";
  }
</script>

<!--Log ud pop up-->
<input type="checkbox" id="logud-modal" class="modal-toggle" />
<label for="logud-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">Er du sikker på at du vil logge ud?</h3>
    <p class="py-4">{"Når du logger bliver alt dataen bortset dit tema og din skole (hvis du har det slået til). Siden vil derfor blive nødt til at loade det hele igen når du logger ind."}</p>
    <span class="flex">
      <div class="modal-action">
        <label for="logud-modal"  class="btn">Forbliv logget ind</label>
      </div> 
      <div class="ml-2 modal-action">
        <a on:click={() => {
          const skoleId = localStorage.getItem("skole_id")
          const theme = localStorage.getItem("theme")
          
          localStorage.clear();

          localStorage.setItem("skole_id", skoleId)
          localStorage.setItem("theme", theme)

          window.location.href = "/";
        }} class="btn btn-error">Log mig ud!</a>
      </div> 
    </span>
  </label>
</label>

<div class="navbar relative z-50 mb-10 bg-base-100 drop-shadow-xl">
  <div class="navbar-start">
    <div class="dropdown">
      <button class="btn-ghost btn xl:hidden" aria-label="navbar button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          /></svg
        >
      </button>
      <ul class="dropdown-content menu rounded-box mt-3 w-52 bg-base-100 p-2 shadow">
        <li><a href="skema">Skema</a></li>
        <li><a href="opgaver">Opgaver</a></li>
        <li><a href="lektier">Lektier</a></li>
        <li><a href="fravær">Fravær</a></li>
        <li><a href="dokumenter">Dokumenter</a></li>
        <li><a href="beskeder">Beskeder</a></li>
        <li><a href="værktøjer">Værktøjer</a></li>
      </ul>
    </div>

    <p
      use:checkIfAuthed
      class="btn-ghost btn mx-0 hidden text-2xl normal-case sm:flex"
      on:keypress={() => {
        /*makes error go away*/
      }}
      on:click={() => {
        if (authed == true) {
          window.location.href = "/forside";
        } else {
          window.location.href = "/";
        }
      }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        height="40"
        class="mx-0 fill-current p-0"
      >
        <path
          d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
        />
        <path
          d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
        />
        <path
          d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
        />
        <path
          d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
        />
      </svg><span class="hidden md:block">Better Lectio</span>
    </p>
  </div>
  <div class="navbar-center hidden xl:flex">
    <ul class="menu menu-horizontal p-0">
      <li><a href="skema">Skema</a></li>
      <li><a href="opgaver">Opgaver</a></li>
      <li><a href="lektier">Lektier</a></li>
      <li><a href="fravær">Fravær</a></li>
      <li><a href="dokumenter">Dokumenter</a></li>
      <li><a href="beskeder">Beskeder</a></li>
      <li><a href="værktøjer">Værktøjer</a></li>
    </ul>
  </div>
  <div class="navbar-center flex sm:hidden">
    <p
      use:checkIfAuthed
      class="btn-ghost btn mx-0 text-2xl normal-case sm:hidden"
      on:keypress={() => {
        /*makes error go away*/
      }}
      on:click={() => {
        if (authed == true) {
          window.location.href = "/forside";
        } else {
          window.location.href = "/";
        }
      }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        height="40"
        class="mx-0 fill-current p-0"
      >
        <path
          d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
        />
        <path
          d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
        />
        <path
          d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
        />
        <path
          d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
        />
      </svg>
    </p>
  </div>
  <div class="navbar-end">
    <ThemeSelect />
    {#if $brugeren && localStorage.getItem("authentication")}
      <div class="dropdown dropdown-bottom dropdown-end">
        <div tabindex="0" class="flex justify-end btn-ghost btn gap-1 normal-case font-normal">
          <Avatar id={"S" + JSON.parse(atob(localStorage.getItem("authentication"))).LastLoginElevId} navn={$brugeren.navn} size="w-10"></Avatar>
          <svg
            width="12px"
            height="12px"
            class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg
          >
        </div>

        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
          <div class="ml-4 mr-4 hidden 2xl:block">
            <h1 class="text-lg font-bold flex justify-start whitespace-nowrap">{$brugeren.navn.split(", ")[0]}</h1>
            <p class="flex justify-start">{$brugeren.navn.split(", ")[1]}</p> 
          </div>
          <li>
            <a href="/indstillinger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              Indstillinger
            </a>
          </li>
          <li>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Reload data
            </a>
          </li>
          <li>
            <label for="logud-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Log ud
          </label>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>

<div
  use:removeLoader
  class="loader absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
  id="loader"
>
  <button class="loading btn-accent btn-circle btn" />
</div>

<div class="container mx-auto">
  <PageTransition pathname={data.pathname}>
    <slot />
  </PageTransition>
</div>
