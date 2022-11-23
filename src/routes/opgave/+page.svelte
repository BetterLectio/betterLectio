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
  let opgave = get("/opgave?exerciseid=" + exerciseid).then((data) => {
    opgave = data;
    let opgaveOplysninger = opgave["oplysninger"];
    opgaveTitel = opgaveOplysninger["opgavetitel:"];
    opgaveNote = opgaveOplysninger["opgavenote:"];
    afleveringsfrist = opgaveOplysninger["afleveringsfrist:"];
    elevtid = opgaveOplysninger["elevtid:"];
    hold = opgaveOplysninger["hold:"];
    let afleveresAf = opgave["afleveres_af"];
    elev = afleveresAf["elev"];
    afventer = afleveresAf["afventer"];
    status = afleveresAf["status_-_fravær"];
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
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{afleveringsfrist}</td>
        <td>{elevtid}</td>
        <td>{hold}</td>
      </tr>
    </tbody>
  </table>

  <h1 class="text-2xl font-bold mb-2">Afleveres af</h1>
  <table class="table w-full shadow-xl rounded-xl">
    <thead>
      <tr>
        <th></th> <!-- Billede TODO-->
        <th>Elev</th>
        <th>Afventer</th>
        <th>Status</th>
        <th>Afsluttet</th>
        <th>Karakter</th>
        <th>Karakternote</th>
        <th>Elevnote</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td> <!-- Billede TODO -->
        <td>{elev}</td>
        <td>{afventer}</td>
        <td>{status}</td>
      </tr>
    </tbody>
  </table>
</div>
