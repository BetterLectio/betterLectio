<script>
  // on button click check for updates
  // if there are updates, show a progress bar
  // if there are no updates, show a message

  import { onMount } from "svelte";

  onMount(() => {
    const btn = document.querySelector(".sfu");
    const progress = document.querySelector(".pb");
    console.log(btn, progress);

    btn.addEventListener("click", () => {
      btn.classList.add("hidden");
      progress.classList.remove("hidden");
      checkForUpdates().then(() => {
        btn.classList.remove("hidden");
        progress.classList.add("hidden");

        // show a message that there are no updates
      });
    });
  });

  async function checkForUpdates() {
    // do stuff

    // this is just a placeholder for now to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
</script>

<h1 class="mb-4 text-3xl font-bold">Indstillinger - Opdateringer</h1>

<div class="flex flex-col">
  <button class="sfu btn-primary btn w-56">søg efter opdateringer</button>

  <progress class="pb progress mt-2 hidden w-56" />
</div>

<h2 class="mt-4 font-mono opacity-20 transition-all duration-300 hover:opacity-100">
  BetterLectio version: {__APP_VERSION__}
</h2>
