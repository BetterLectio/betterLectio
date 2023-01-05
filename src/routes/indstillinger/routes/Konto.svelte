<script>
    import { brugeren } from "../../../components/store.js";
    import { get } from "../../../components/http.js";
    import Avatar from "../../../components/Avatar.svelte";
    import { cookieInfo } from "../../../components/CookieInfo";
    import { addNotification } from "../../../components/notifyStore.js";
    let cookie;
    cookieInfo().then(data => {
      cookie = data;
    })
  
    get("/mig").then((data) => {
      $brugeren = data;
    });
    const school = localStorage.getItem("skole_id");
  </script>
  
  <svelte:body src="http://danml.com/js/download.js" />
  
  <h1 class="mb-4 text-3xl font-bold">Indstillinger - Din konto</h1>
  
  <div>
    <div class="form-control">
        <div class="flex">
            <div class="block mr-4">
                <label class="label">
                  <span class="label-text">Brugernavn</span>
                </label>
                <label class="input-group">
                  <span>Brugernavn</span>
                  <input type="text" placeholder="abcd4" class="input input-bordered">
                </label>

                <label class="label">
                  <span class="label-text">Adgangskode</span>
                </label>
                <label class="input-group">
                  <span>Adgangskode</span>
                  <input type="text" placeholder="*******" class="input input-bordered">
                </label>
            </div>

            <div class="block">
                <label class="label">
                  <span class="label-text">Profil billed</span>
                </label>
                {#if cookie}
                  <div class="hover:cursor-not-allowed hover:opacity-70" on:click={() => addNotification("Denne handling kræver Better Lectio Pro", "alert-error")}>
                      <Avatar
                          id={"S" + cookie.userid}
                          navn={$brugeren.navn}
                          size="w-20"
                      />
                  </div>
                {/if}
            </div>
        </div>
    </div>
  </div>

  <div class="flex flex-col mt-10">
    <ul class="menu rounded-box w-full whitespace-nowrap bg-base-100 p-2 drop-shadow-xl md:w-fit">
      <li class="menu-title">
        <span>Bruger info</span>
      </li>
      {#if $brugeren?.navn}
        <li class="tooltip" data-tip="Lectio navn">
          <p id="user">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>{$brugeren.navn}
          </p>
        </li>
      {/if}
      {#if school}
        <li class="tooltip" data-tip="Dit skole-ID">
          <p id="scho">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-building"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"
              />
              <path
                d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"
              />
            </svg>{school}
          </p>
        </li>
      {/if}
    </ul>
    <div class="flex flex-col md:flex-row">
      <button
        class="btn-error btn mt-8 font-bold drop-shadow-xl md:w-fit md:font-normal"
        on:click={() => {
          localStorage.removeItem("lectio-cookie");
          window.location.href = "/";
        }}>Log ud</button
      >
      <div class="btn-warning btn mt-8 font-bold drop-shadow-xl md:ml-4 md:w-fit md:font-normal">
        <a href="https://github.com/betterlectio/betterLectio/issues/"> Rapporter Fejl </a>
      </div>
    </div>
  </div>
  