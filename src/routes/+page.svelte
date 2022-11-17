<script>
  async function checkIfAuthed() {
    if (localStorage.getItem("authentication") == null) {
    } else {
      const response = await fetch(
        `https://better-lectio-flask-backend.vercel.app/check-cookie?cookie=${localStorage.getItem(
          "authentication"
        )}`
      );
      let jsonRes = await response.json();
      console.log(jsonRes["valid"]);
      if (jsonRes["valid"] == true) {
        console.log("Redirect");
        window.location.href = "/hjem";
      }
    }
  }
</script>

<div>
  <h1 use:checkIfAuthed class="text-3xl font-bold">Velkommen til Better Lectio</h1>
  <p>Better Lectio er en webapp, der gør det nemmere at bruge Lectio.</p>
  <p>For at bruge Better Lectio skal du logge ind med din Lectio konto.</p>
  <br />

  <a rel="external" href="/auth" class="btn btn-primary">Log ind</a>
  <a href="/help" class="btn">Hvordan virker det?</a>
</div>

<div
  class="absolute w-screen h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 bg-gradient-to-br from-base-100 to-primary "
/>
