<script>
  function tryLoginInWithCookie() {
    if (localStorage.getItem("authentication")) {
      fetch(`https://better-lectio-flask-backend.vercel.app/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("authentication"),
        },
      }).then((res) => {
        res.json().then((data) => {
          if (data && data.valid) {
            console.log("Logged in with cookie");
            window.location.href = "/forside";
          } else {
            console.log("Cookie not valid");
          }
        });
      });
    }
  }
  tryLoginInWithCookie();
</script>

<div>
  <h1 class="text-3xl font-bold">Velkommen til Better Lectio</h1>
  <p>Better Lectio er en webapp, der gør det nemmere at bruge Lectio.</p>
  <p>For at bruge Better Lectio skal du logge ind med din Lectio konto.</p>
  <br />

  <a rel="external" href="/auth" class="btn-primary btn">Log ind</a>
  <a href="/help" class="btn">Hvordan virker det?</a>
</div>

<div
  class="absolute top-1/2 left-1/2 -z-10 h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform bg-gradient-to-br from-base-100 to-primary "
/>
