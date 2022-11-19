<script>
    import { page } from '$app/stores';
    import { get } from "../../components/http.js"

    const exerciseid = $page.url.searchParams.get('exerciseid');

    let opgave = null
    async function fåOpgave() {
        opgave = await get("/opgave?exerciseid=" + exerciseid)
    }
    fåOpgave()
</script>

<p>{JSON.stringify(opgave)}</p>