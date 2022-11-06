<h1 class="text-3xl font-bold">Indstillinger</h1>
<br />

<div class="flex flex-col">
    <button class="btn btn-error md:w-fit font-bold md:font-normal"
    on:click={() => {
        localStorage.removeItem("authentication");
        window.location.href = "/";
    }}>Log ud</button>
</div>
