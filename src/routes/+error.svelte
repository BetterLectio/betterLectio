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
  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 loader flex-col flex items-center"
>
  <span class="text-3xl my-4">404</span>
  <span class="text-2xl font-bold my-4">{fejlBeskrivelse}</span>
  <a href="/" class="btn btn-accent my-4">Tilbage</a>
</div>
