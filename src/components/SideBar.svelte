<script>
  import { brugeren } from "./store.js";
  import { cookieInfo } from "./CookieInfo";
  import Avatar from "./Avatar.svelte";
  import { reloadData } from "./http";
  import Themes from "./Themes.svelte";

  let cookie;
  cookieInfo().then((data) => {
    cookie = data;
  });
</script>

<div
  class="fixed z-30 hidden h-100v w-16 flex-col justify-between rounded-xl rounded-l-none bg-base-300 p-1 md:flex"
>
  <div>
    <a
      href="/forside"
      class="group btn-primary btn mb-1 flex h-14 w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
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

      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Forside</span
      >
    </a>
    <label
      for="søg-popup"
      class="group btn mb-1 flex h-14 w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        class="bi bi-search"
        viewBox="0 0 16 16"
        ><path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Søg</span
      >
    </label>
    <div class="my-4" />
    <a
      href="/skema"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-calendar2-week-fill"
        viewBox="0 0 16 16"
        ><path
          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zM8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
        /></svg
      >

      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Skema</span
      >
    </a>
    <a
      href="/opgaver"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-list-task"
        viewBox="0 0 16 16"
        ><path
          fill-rule="evenodd"
          d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
        /><path
          d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"
        /><path
          fill-rule="evenodd"
          d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
        /></svg
      >

      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Opgaver</span
      >
    </a>
    <a
      href="/lektier"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-bookmarks-fill"
        viewBox="0 0 16 16"
        ><path
          d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z"
        /><path
          d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z"
        /></svg
      >

      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Lektier</span
      >
    </a>
    <a
      href="/fravær"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-bar-chart-fill"
        viewBox="0 0 16 16"
        ><path
          d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Fravær</span
      >
    </a>
    <a
      href="/dokumenter"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-files"
        viewBox="0 0 16 16"
        ><path
          d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-28 group-hover:opacity-100"
        >Dokumenter</span
      >
    </a>
    <a
      href="/beskeder"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-chat-left-text-fill"
        viewBox="0 0 16 16"
        ><path
          d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100"
        >Beskeder</span
      >
    </a>
    <a
      href="/karakterer"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-mortarboard-fill"
        viewBox="0 0 16 16"
        ><path
          d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"
        /><path
          d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-28 group-hover:opacity-100"
        >Karakterer</span
      >
    </a>
    <a
      href="/værktøjer"
      class="group btn-sm btn mb-1 flex w-full flex-row overflow-x-hidden p-0 transition-[width] duration-300 hover:w-44"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-tools"
        viewBox="0 0 16 16"
        ><path
          d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"
        /></svg
      >
      <span class=" w-0 opacity-0 transition-all duration-300 group-hover:w-28 group-hover:opacity-100"
        >Værktøjer</span
      >
    </a>
  </div>
  <div>
    <div class="dropdown-top dropdown z-50 mb-1 w-full">
      <button class="btn-sm btn w-full" for="theme-select" tabindex="0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          class="bi bi-palette"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
          />
          <path
            d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"
          />
        </svg></button
      >
      <ul
        class="dropdown-content menu rounded-box z-50 mt-3 flex w-52 bg-base-100 p-2 shadow"
        id="theme-select"
        tabindex="0"
      >
        <Themes class="z-50" />
      </ul>
    </div>
    {#if $brugeren && localStorage.getItem("lectio-cookie") && cookie}
      <a href="/indstillinger" class="group btn mb-1 h-14 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          class="bi bi-gear-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
          />
        </svg>
      </a>
      <div
        tabindex="0"
        class="group btn flex h-14 w-full flex-row flex-nowrap justify-between overflow-x-hidden whitespace-nowrap px-3 pl-2 transition-[width] duration-300  hover:w-80"
      >
        <div class="pl-[1.8px] pt-[1.5px]">
          <Avatar id={"S" + cookie.userid} navn={$brugeren.navn} size="w-[2.1rem]" />
        </div>
        <button
          class="btn-warning btn-sm btn-circle btn w-36 border-none opacity-0 transition-all duration-300 group-hover:opacity-100"
          on:click={() => {
            reloadData();
          }}>Reload Data</button
        >
        <label
          class="btn-error btn-sm btn-circle btn w-24 border-none opacity-0 transition-all duration-300 group-hover:opacity-100"
          for="logud-modal">Log ud</label
        >
      </div>
    {/if}
  </div>
</div>
