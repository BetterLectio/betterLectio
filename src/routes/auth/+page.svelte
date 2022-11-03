<h1>Log ind med din Lectio-konto</h1>
<form action="login">
    <script src="https://cdn.jsdelivr.net/gh/Asguho/LectioJS/api.js"></script>
    <select class="select select-bordered select-primary w-full max-w-xs">
        <option disabled selected>Vælg skole</option>
    </select>
    <br />
    <input
        type="text"
        name="username"
        id="username"
        class="input input-bordered input-primary w-full max-w-xs"
        placeholder="Brugernavn"
    />
    <br />
    <input
        type="password"
        name="password"
        id="password"
        class="input input-bordered input-primary w-full max-w-xs"
        placeholder="Kodeord"
    />
    <br />
    <button type="submit" class="btn btn-primary">Log ind</button>
</form>
