<script>
  import { fly } from "svelte/transition";
  import { quintIn, quintInOut, quintOut } from "svelte/easing";

  //if (localStorage.getItem("lectio-cookie")) {
  //  window.location.href = "/forside";
  //}
</script>

<div class="flex flex-row">
  <div>
    <h1
      class="text-6xl font-extrabold md:text-8xl lg:text-9xl"
      in:fly={{ duration: 1000, y: 0, x: -50, easing: quintInOut }}
    >
      BetterLectio
    </h1>
    <p
      class="mb-6 text-2xl font-extrabold md:text-3xl lg:text-4xl"
      in:fly={{ duration: 1000, y: -30, x: 0, easing: quintInOut, delay: 500 }}
    >
      - Den ultimative Lectio-forbedring!
    </p>
    <div class="w-fit rounded-lg bg-base-content p-4">
      <p class="font-semibold text-base-100 md:text-xl">
        Prøv BetterLectio i dag og oplev, hvordan det kan forbedre din Lectio-oplevelse
      </p>
      <div class="mt-4 flex flex-col md:flex-row">
        <a href="/auth" class="btn-primary btn" in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 700 }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-box-arrow-in-right mr-2"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
            />
            <path
              fill-rule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
            />
          </svg>{(localStorage.getItem("lectio-cookie")) ? "Åben app" : "Log ind"}</a
        >
        <a href="/help" class="btn-secondary btn mt-2 md:ml-4 md:mt-0" in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 1000 }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-info-square mr-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
            />
            <path
              d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
            />
          </svg>Hvordan virker det?</a
        >
        <a href="https://github.com/BetterLectio/betterLectio" class="btn-secondary btn mt-2 md:ml-4 md:mt-0" in:fly={{ duration: 1000, y: 0, x: -30, easing: quintInOut, delay: 1300 }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-github mr-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>Github</a
        >
      </div>
    </div>
  </div>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    class="mx-0 hidden rotate-12 fill-current p-0 xl:flex"
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
</div>

<div class="mt-6 rounded-lg bg-base-200 p-4">
  <h1 class="mb-2 text-4xl font-extrabold">Hvad er BetterLectio?</h1>

  <p>
    BetterLectio er en forbredelse af Lectio. Lectio er et dansk webbaseret lektionssystem udviklet af det
    danske softwarefirma MaCom A/S. vi har udviklet BetterLectio for at gøre det nemmere at bruge Lectio. Vi
    har fokuseret på at gøre det nemmere at finde informationer, og at gøre det nemmere at få overblik over
    sin skolegang. og vi har lavet en række andre forbedringer som f.eks. at lave en hel ny brugerflade, som
    både er mere brugervenlig og mere moderne.
  </p>

  <p class="mt-2 font-semibold">
    BetterLectio er et open source projekt, hvilket betyder at alle kan se koden, og alle kan bidrage til
    projektet. BetterLectio er på nuværende tidspunkt under udvikling, hvis du har nogle forslag til
    forbedringer, eller hvis du har fundet en fejl, så er du meget velkommen til åbne en issue, eller lave en
    pull request.
  </p>
</div>
