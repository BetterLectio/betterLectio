<script>
  import { page } from "$app/stores";
  import { get } from "../../components/http.js";

  import MarkdownIt from "markdown-it";
  import sanitizeHtml from "sanitize-html";

  const md = new MarkdownIt();

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
  let opgaveIndlæg = [];
  let elevId = "";
  let opgave = get("/opgave?exerciseid=" + exerciseid).then((data) => {
    console.log("data:", data);
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
    opgaveIndlæg = opgave["opgave_indlæg"];
    elevId = elev.bruger_id.slice(1);
  });

  let alreadyLoaded = [];
  let loadedIndex = {};
  function loadImage(element) {
    console.log(element);
    if (!alreadyLoaded.includes(element.id)) {
      alreadyLoaded.push(element.id);
      console.log(element.id);
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob"; //so you can access the response like a normal URL
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          let src = URL.createObjectURL(xhr.response);
          element.outerHTML = `<img id="${element.id}" src="${src}" class="object-cover h-10 w-10"/>`;
          loadedIndex[element.id] = src;
        }
      };
      xhr.open(
        "GET",
        `https://better-lectio-flask-backend.vercel.app/profil_billed?id=${element.id}&fullsize=1`,
        true
      );
      xhr.setRequestHeader("lectio-cookie", localStorage.getItem("authentication"));
      xhr.send();
    } else {
      useLoadedImage(element);
    }
  }
  async function useLoadedImage(element) {
    while (true) {
      if (loadImage[element.id] == undefined) {
        console.log("undefined", typeof loadedIndex[element.id]);
      } else {
        console.log("UNDEUNDEUND");
        element.outerHTML = `<img id="${element.id}" src="${
          loadImage[element.id]
        }" class="object-cover h-10 w-10"/>`;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
</script>

<div class="hidden md:block">
  <h1 class="mb-4 text-3xl font-bold">{opgaveTitel}</h1>
  <p class="mb-4">{opgaveNote}</p>
  <h1 class="mb-2 text-2xl font-bold">Oplysninger</h1>
  <table class="mb-4 table w-full rounded-xl shadow-xl">
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

  <h1 class="mb-2 text-2xl font-bold">Afleveres af</h1>
  <table class="mb-4 table w-full rounded-xl shadow-xl">
    <thead>
      <tr>
        <th />
        <!-- Billede TODO-->
        <th>Elev</th>
        <th>Afventer</th>
        <th>Status</th>
        <th>Afsluttet</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        {#if typeof elev["bruger_id"] == "string"}
          <td><div id={elev["bruger_id"]} use:loadImage /></td>
        {/if}
        <td>{elev["navn"]}</td>
        <td>{afventer}</td>
        <td>{status}</td>
        <td>{afsluttet}</td>
      </tr>
    </tbody>
  </table>
  {#if karakter != "" || karakternote != "" || elevnote != ""}
    <h1 class="mb-2 text-2xl font-bold">Feedback</h1>
    <table class="mb-4 table w-full rounded-xl shadow-xl">
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
  {/if}
  <h1 class="mb-2 text-2xl font-bold">Opgave Indlæg</h1>
  {#if opgaveIndlæg.length != 0}
    <table class="mb-4 table w-full rounded-xl shadow-xl">
      <thead>
        <tr>
          <th />
          <!-- Billede TODO-->
          <th>Bruger</th>
          <th>Indlæg</th>
          <th>Dokument</th>
          <th>Tidspunkt</th>
        </tr>
      </thead>
      <tbody>
        {#each opgaveIndlæg as indlæg}
          <tr>
            <td><div id={indlæg["bruger"]["bruger_id"]} use:loadImage /></td>
            <!-- <td><img src="https://i.stack.imgur.com/34AD2.jpg" alt="profile pic" class="h-10 " /></td> -->
            <!-- Billede TODO -->
            <td>{indlæg["bruger"]["navn"]}</td>
            <td>{indlæg["indlæg"]}</td>
            <td
              >{@html sanitizeHtml(md.render(indlæg["dokument"])).replace(
                "<a",
                '<a class="btn btn-xs btn-primary" target="_blank"'
              )}</td
            >
            <td>{indlæg["tidspunkt"]}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <a
      href="https://www.lectio.dk/lectio/681/ElevAflevering.aspx?elevid={elevId}&exerciseid={exerciseid}"
      class="btn-primary btn">Aflever Her!</a
    >
  {/if}
</div>
<div class="block md:hidden">
  <h1 class="mb-4 text-3xl font-bold">{opgaveTitel}</h1>
  <p class="mb-4">{opgaveNote}</p>
  <h1 class="mb-2 text-xl font-bold">Oplysninger</h1>
  <ul class="menu rounded-box flex w-full bg-base-100 p-2">
    <li>
      <span class="w-full"
        ><p>Afleveringsfrist:</p>
        {afleveringsfrist}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Elevtid:</p>
        {elevtid}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Hold:</p>
        {hold}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Karakterskala:</p>
        {karakterskala}</span
      >
    </li>
  </ul>
  <h1 class="mb-2 text-xl font-bold">Afleveres af</h1>
  <ul class="menu rounded-box flex w-full bg-base-100 p-2">
    <li>
      <span class="w-full"
        ><p>Elev:</p>
        {elev}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Afventer:</p>
        {afventer}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Status:</p>
        {status}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Afsluttet:</p>
        {afsluttet}</span
      >
    </li>
  </ul>
  <h1 class="mb-2 text-xl font-bold">Feedback</h1>
  <ul class="menu rounded-box flex w-full bg-base-100 p-2">
    <li>
      <span class="w-full"
        ><p>Karakter:</p>
        {karakter}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Karakternote:</p>
        {karakternote}</span
      >
    </li>
    <li>
      <span class="w-full"
        ><p>Elevnote:</p>
        {elevnote}</span
      >
    </li>
  </ul>
</div>
