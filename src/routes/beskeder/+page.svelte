<script>
    /**
     TODO:
        - Gør så man kan downloade filer uden at blive redirectet til modul siden
        - Måske gør så man får al teksten og derfor ikke behøver at klikke på lektien
     */
    import { get } from "../../components/http.js"

    let beskeder = [];
    async function fåBeskeder() {
        beskeder = await get(
            `/beskeder`
        );
        console.log(beskeder);
    }
</script>

<body use:fåBeskeder>
    <h1 class="text-3xl font-bold">Beskeder</h1>
    <br/>
    <ul class="menu bg-base-100 w-full p-2 rounded-box drop-shadow-xl md:w-fit">
        {JSON.stringify(beskeder)}
    </ul>
</body>