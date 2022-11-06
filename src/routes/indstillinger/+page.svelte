<script>
    let user = 'Loading...';
    let school = 'Loading...';
    let cookie = '';

     async function checkUser() {
         if (localStorage.getItem("authentication") == null) {
             console.log("Redirect")
             window.location.href = "/auth";
         } else {
            let decodedCookie = atob(localStorage.getItem("authentication"));
            cookie = JSON.parse(decodedCookie);
            user = cookie["LastLoginUserName"];
            school = cookie["LastLoginExamno"];
         }
     }
     function downloadCookie() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(cookie, null, 2)));
        element.setAttribute('download', "cookie.json");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
     }
</script>

<svelte:body src="http://danml.com/js/download.js" />

<h1 class="text-3xl font-bold">Indstillinger</h1>
<br />

<div class="flex flex-col">
    <ul use:checkUser class="menu bg-base-100 w-56 p-2 rounded-box drop-shadow-xl -z-10">
        <li class="menu-title">
            <span>Bruger info</span>
        </li>
        <li><p id="user">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>{user}</p></li>
        <li><p id="scho">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-building" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>
                <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z"/>
            </svg>{school}</p></li>
        <li class="menu-title">
            <span>Cookie</span>
        </li>
        <li><p id="cookie" on:click={downloadCookie} on:keydown={() => {/*this makes it work for some reason*/}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>Download</p></li>

    </ul>
    <br>
    <button class="btn btn-error md:w-fit font-bold md:font-normal -z-10"
    on:click={() => {
        localStorage.removeItem("authentication");
        window.location.href = "/";
    }}>Log ud</button>
</div>
