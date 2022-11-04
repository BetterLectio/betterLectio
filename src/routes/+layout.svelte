<script>
    import "../app.css";
</script>

<div class="navbar bg-base-100 drop-shadow-xl mb-10">
    <div class="navbar-start">
        <div class="dropdown">
            <button class="btn btn-ghost lg:hidden">
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
            </ul>
        </div>
        <a class="btn btn-ghost normal-case text-2xl" href="/">Better Lectio</a>
    </div>
    <div class="navbar-end hidden lg:flex" style="width: 75%;">
        <ul class="menu menu-horizontal p-0">
            <li><a href="skema">Skema</a></li>
            <li><a href="opgaver">Opgaver</a></li>
            <li><a href="lektier">Lektier</a></li>
            <li><a href="fravær">Fravær</a></li>
            <li><a href="dokumenter">Dokumenter</a></li>
            <li><a href="beskeder">Beskeder</a></li>
            <li><a href="indstillinger">Indstillinger</a></li>
        </ul>
    </div>
</div>

<div class="container">
    <slot />
</div>
