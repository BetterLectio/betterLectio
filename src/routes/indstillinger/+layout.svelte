<script>
    export let data;

    let selected = window.location.href.split("?")[0].split("/").splice(-1)[0];
</script>

<div class="min-h-screen flex">
    <nav class="w-56 flex-none mr-4">
        <ul class="menu bg-base-200 p-2 rounded-box">
          <li class=mb-1><a href="konto" class="font-bold {(selected == "konto") ? "active" : ""}">Din Konto</a></li>
          <li class=mb-1><a href="tilslut" class="font-bold {(selected == "tilslut") ? "active" : ""}">Tilsluttede tjenester</a></li>
          <li class=mb-1><a href="tema" class="font-bold {(selected == "tema") ? "active" : ""}">Tema</a></li>
          <li class=mb-1><a href="pro" class="font-bold {(selected == "pro") ? "active" : ""}">Better Lectio Pro</a></li>
          <li class=mb-1><a href="api" class="font-bold {(selected == "api") ? "active" : ""}">API</a></li>
        </ul>
    </nav>

    <main class="flex-1 min-w-0 overflow-auto">
        <slot />
    </main>
</div>
