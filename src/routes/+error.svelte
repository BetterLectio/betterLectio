<script>
  import { blur } from 'svelte/transition';
  import { addNotification } from '../components/notifyStore';

  const getCurrentEndpoint = () => {
    const url = new URL(window.location.href);
    return url.pathname;
  };
    addNotification(`404 - kunne ikke finde ${getCurrentEndpoint()}`, 'alert-error');
</script>


<h1 class="text-9xl font-black text-center" in:blur="{{duration: 1300}}">
  404
</h1>

<h2 class="text-3xl font-black text-center" in:blur="{{duration: 1300, delay: 325}}">
  Det lader til at du er gået lidt forkert...
</h2>

<p class="text-center mt-10" in:blur="{{duration: 1300, delay: 650}}">
  <a href="/forside" class="btn btn-sm">Gå tilbage</a>
</p>