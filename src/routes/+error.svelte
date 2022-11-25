<script>
  let fejlBeskrivelser = [
    "Denne side eksisterer ikke. Prøv at gå tilbage til forsiden.",
    "Vi kunne ikke finde siden du leder efter",
    "Vi gjorer vores bedste, men vi kunne ikke finde siden du leder efter",
    "Vi har ikke fundet siden du leder efter",
    "Vi unskylder men vi kunne ikke finde siden du leder efter",
  ];
  let fejlBeskrivelse = fejlBeskrivelser[Math.floor(Math.random() * fejlBeskrivelser.length)];
</script>

<div
  class="loader absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center"
>
  <span class="my-4 text-3xl">404</span>
  <span class="my-4 text-2xl font-bold">{fejlBeskrivelse}</span>
  <a href="/" class="btn-accent btn my-4">Tilbage</a>
</div>
