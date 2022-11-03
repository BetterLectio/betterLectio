<script>
    import "../app.css";
</script>

<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <ul
                tabindex="-1"
                class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li><a href="/">Item 1</a></li>
                <li tabindex="-1">
                    <a class="justify-between">
                        Parent
                        <svg
                            class="fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            ><path
                                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                            /></svg
                        >
                    </a>
                    <ul class="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                </li>
                <li><a>Item 3</a></li>
            </ul>
        </div>
        <a class="btn btn-ghost normal-case text-xl">daisyUI</a>
    </div>
    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal p-0">
            <li><a>Item 1</a></li>
            <li tabindex="-1">
                <a>
                    Parent
                    <svg
                        class="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        ><path
                            d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
                        /></svg
                    >
                </a>
                <ul class="p-2">
                    <li><a>Submenu 1</a></li>
                    <li><a>Submenu 2</a></li>
                </ul>
            </li>
            <li><a>Item 3</a></li>
        </ul>
    </div>
    <div class="navbar-end">
        <a class="btn">Get started</a>
    </div>
</div>

<slot />
