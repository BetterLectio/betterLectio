<script>
  import { page } from "$app/stores";
  import { get } from "../../components/http.js";

  const exerciseid = $page.url.searchParams.get("exerciseid");

  let opgaveTitel = "Indlæser...";
  let opgaveNote = "";
  let afleveringsfrist = "";
  let elevtid = "";
  let hold = "";
  let elev = "";
  let afventer = "";
  let status = "";
  let afsluttet = "";
  let karakterskala = "";
  let karakter = "";
  let karakternote = "";
  let elevnote = "";
  let opgave = get("/opgave?exerciseid=" + exerciseid).then((data) => {
    opgave = data;
    console.log(opgave);
    let opgaveOplysninger = opgave["oplysninger"];
    opgaveTitel = opgaveOplysninger["opgavetitel:"];
    opgaveNote = opgaveOplysninger["opgavenote:"];
    afleveringsfrist = opgaveOplysninger["afleveringsfrist:"];
    elevtid = opgaveOplysninger["elevtid:"];
    hold = opgaveOplysninger["hold:"];
    karakterskala = opgaveOplysninger["karakterskala:"];
    let afleveresAf = opgave["afleveres_af"];
    elev = afleveresAf["elev"];
    afventer = afleveresAf["afventer"];
    status = afleveresAf["status_-_fravær"];
    let afsluttetBool = afleveresAf["afsluttet"];
    afsluttet = afsluttetBool ? "Ja" : "Nej";
    karakter = afleveresAf["karakter"];
    karakternote = afleveresAf["karakternote"];
    elevnote = afleveresAf["elevnote"];
  });
</script>

<div class="hidden md:block">
  <h1 class="text-3xl font-bold mb-4">{opgaveTitel}</h1>
  <p class="mb-4">{opgaveNote}</p>
  <h1 class="text-2xl font-bold mb-2">Oplysninger</h1>
  <table class="table w-full shadow-xl rounded-xl mb-4">
    <thead>
      <tr>
        <th>Afleveringsfrist</th>
        <th>Elevtid</th>
        <th>Hold</th>
        <th>Karakterskala</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{afleveringsfrist}</td>
        <td>{elevtid}</td>
        <td>{hold}</td>
        <td>{karakterskala}</td>
      </tr>
    </tbody>
  </table>

  <h1 class="text-2xl font-bold mb-2">Afleveres af</h1>
  <table class="table w-full shadow-xl rounded-xl mb-4">
    <thead>
      <tr>
        <th></th> <!-- Billede TODO-->
        <th>Elev</th>
        <th>Afventer</th>
        <th>Status</th>
        <th>Afsluttet</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><img src="https://i.stack.imgur.com/34AD2.jpg" alt="profile pic" class="h-10 "></td> <!-- Billede TODO -->
        <td>{elev}</td>
        <td>{afventer}</td>
        <td>{status}</td>
        <td>{afsluttet}</td>
      </tr>
    </tbody>
  </table>
  <h1 class="text-2xl font-bold mb-2">Feedback</h1>
  <table class="table w-full shadow-xl rounded-xl mb-4">
    <thead>
      <tr>
        <th>Karakter</th>
        <th>Karakternote</th>
        <th>Elevnote</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{karakter}</td>
        <td>{karakternote}</td>
        <td>{elevnote}</td>
      </tr>
    </tbody>
  </table>
</div>
<div class="block md:hidden">
  <h1 class="text-3xl font-bold mb-4">{opgaveTitel}</h1>
  <p class="mb-4">{opgaveNote}</p>
  <h1 class="text-xl font-bold mb-2">Oplysninger</h1>
  <ul class="menu bg-base-100 w-full p-2 rounded-box flex">
    <li>
      <span class="w-full"><p>Afleveringsfrist:</p>{afleveringsfrist}</span>
    </li>
    <li>
      <span class="w-full"><p>Elevtid:</p>{elevtid}</span>
    </li>
    <li>
      <span class="w-full"><p>Hold:</p>{hold}</span>
    </li>
    <li>
      <span class="w-full"><p>Karakterskala:</p>{karakterskala}</span>
    </li>
  </ul>
  <h1 class="text-xl font-bold mb-2">Afleveres af</h1>
  <ul class="menu bg-base-100 w-full p-2 rounded-box flex">
    <li>
      <span class="w-full"><p>Elev:</p>{elev}</span>
    </li>
    <li>
      <span class="w-full"><p>Afventer:</p>{afventer}</span>
    </li>
    <li>
      <span class="w-full"><p>Status:</p>{status}</span>
    </li>
    <li>
      <span class="w-full"><p>Afsluttet:</p>{afsluttet}</span>
    </li>
  </ul>
  <h1 class="text-xl font-bold mb-2">Feedback</h1>
  <ul class="menu bg-base-100 w-full p-2 rounded-box flex">
    <li>
      <span class="w-full"><p>Karakter:</p>{karakter}</span>
    </li>
    <li>
      <span class="w-full"><p>Karakternote:</p>{karakternote}</span>
    </li>
    <li>
      <span class="w-full"><p>Elevnote:</p>{elevnote}</span>
    </li>
  </ul>
</div>
