<script>
  import { blur } from "svelte/transition";
  import { addNotification } from "$lib/js/notifyStore";

  const getCurrentEndpoint = () => {
    const url = new URL(window.location.href);
    return url.pathname;
  };
  addNotification(`404 - kunne ikke finde ${getCurrentEndpoint()}`, "alert-error");
</script>

<h1 class="text-center text-9xl font-black" in:blur={{ duration: 1300 }}>404</h1>

<h2 class="text-center text-3xl font-black" in:blur={{ duration: 1300, delay: 325 }}>Det lader til at du er gået lidt forkert...</h2>

<p class="mt-10 text-center" in:blur={{ duration: 1300, delay: 650 }}>
  <a href="/forside" class="btn-sm btn">Gå tilbage</a>
</p>
