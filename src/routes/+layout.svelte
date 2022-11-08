<script>
    import { onMount } from 'svelte'
    import { themeChange } from 'theme-change'
    import '../app.css'
	import PageTransition from '../components/PageTransition.svelte';
	export let data;

    onMount(() => {
        themeChange(false)
    })
    import ThemeSelect from '../components/theme-select.svelte'
    let authed = false;
    async function checkIfAuthed() {
        if (localStorage.getItem("authentication") == null) {
        } else {
            // Dette neden under er udkomenteret da man automatisk vil blive bedt om at logge ind på /hjem hvis cookien ikke virker
            //const response = await fetch(
            //    `https://better-lectio-flask-backend.vercel.app/check-cookie?cookie=${localStorage.getItem("authentication")}`
            //);
            //let jsonRes = await response.json();
            //if (jsonRes["valid"] == true) {
            authed = true;
            //}
        }
    }
    function removeLoader() {
        let loader = document.querySelector(".loader");
        console.log(loader);
        loader.style.display = "none";
    }
</script>

<div class="navbar bg-base-100 drop-shadow-xl mb-10">
    <div class="navbar-start">
        <div class="dropdown">
            <button class="btn btn-ghost xl:hidden" aria-label="navbar button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                    /></svg
                >
            </button>
            <ul
                class="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li><a href="skema">Skema</a></li>
                <li><a href="opgaver">Opgaver</a></li>
                <li><a href="lektier">Lektier</a></li>
                <li><a href="fravær">Fravær</a></li>
                <li><a href="dokumenter">Dokumenter</a></li>
                <li><a href="beskeder">Beskeder</a></li>
                <li><a href="indstillinger">Indstillinger</a></li>
                <li>
                    <ThemeSelect />
                </li>
            </ul>
        </div>
        <p use:checkIfAuthed class="btn btn-ghost normal-case text-2xl" on:keypress={() => {/*makes error go away*/}}
            on:click={() => {
                if (authed == true) {
                    window.location.href = "/hjem";
                } else {
                    window.location.href = "/";
                }
            }}
        >Better Lectio</p>
    </div>
    <div class="navbar-end hidden xl:flex" style="width: 90%;">
        <ul class="menu menu-horizontal p-0">
            <li><a href="skema">Skema</a></li>
            <li><a href="opgaver">Opgaver</a></li>
            <li><a href="lektier">Lektier</a></li>
            <li><a href="fravær">Fravær</a></li>
            <li><a href="dokumenter">Dokumenter</a></li>
            <li><a href="beskeder">Beskeder</a></li>
            <li><a href="indstillinger">Indstillinger</a></li>
            <li class="">
                <ThemeSelect />
            </li>
        </ul>
    </div>
</div>

<div use:removeLoader class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 loader" id="loader"><button class="btn btn-circle btn-accent loading"></button></div>


<div class="container mx-auto">
    <PageTransition pathname={data.pathname}>
        <slot />
    </PageTransition>
</div>
