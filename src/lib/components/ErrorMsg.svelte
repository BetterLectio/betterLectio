<!-- 
<script>
  console.log("error check active");
  let error;
  let details;
  
  addEventListener("error", (event) => {
    console.log("unhandledrejection");
    console.log(event);
    error = event.reason;
    details = JSON.stringify(event);
    document.getElementById("error-modal").checked = true;
    });
  
    addEventListener("unhandledrejection", (event) => {
      console.log("unhandledrejection");
      console.log(event);
      error = event.reason;
      details = JSON.stringify(event);
      document.getElementById("error-modal").checked = true;
    });
    
    function reloadPage() {
      location.reload();
    }
    </script>
  
  <input type="checkbox" id="error-modal" class="modal-toggle" />
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-2xl font-bold">Der er sket en fejl</h3>
      <p class="pt-4">
        Der er sket en fejl, som vi ikke forventede. Prøv at genindlæse siden. Hvis fejlen fortsætter, så kontakt os venligst.
        eller opret en fejlrapport på Discord eller GitHub.
      </p>
      <div class="divider" />
      <div class="mockup-code">
        <pre class="text-warning"><code>{error}</code></pre>
        <pre class="text-error"><code>{details}</code></pre>
      </div>
      <div class="modal-action">
        <a href="/forside" data-sveltekit-reload class="btn-success btn-sm btn">Genindlæs</a>
      </div>
    </div>
  </div>
-->
