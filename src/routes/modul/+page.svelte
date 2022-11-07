<script>
    import { page } from '$app/stores';
    import { get } from "../../components/http.js"
    
	import MarkdownIt from 'markdown-it'
	import sanitizeHtml from 'sanitize-html'
    
	const md = new MarkdownIt();

    const absid = $page.url.searchParams.get('absid');

    let modul;
    let lektieHtml = "";
    let øvrigeIndholdHtml = "";
    let ready = false;
    
    async function getModul() {
        modul = await get(`/modul?absid=${absid}`);

        await modul.lektier.split("\n").forEach(element => {
            let translated = sanitizeHtml(md.render(element)).replace("<a", "<a class=\"underline text-blue-600 hover:text-blue-800 visited:text-purple-600\" target=\"_blank\"")
            lektieHtml +=  "<p>" + translated + "<p/>"
        });
        await modul.øvrigtIndhold.split("\n").forEach(element => {
            let translated = sanitizeHtml(md.render(element)).replace("<a", "<a class=\"underline text-blue-600 hover:text-blue-800 visited:text-purple-600\" target=\"_blank\"")
            øvrigeIndholdHtml +=  "<p>" + translated + "<p/>"
        });

        ready = true;
    }
    getModul ()
</script>


<div>
    {#if ready}
        <h1 class="text-3xl font-bold">{(modul.aktivitet.navn != null) ? modul.aktivitet.navn + " - " : ""}{modul.aktivitet.hold}</h1>
        <p><strong>Tidspunkt: </strong>{modul.aktivitet.tidspunkt}</p>
        <p><strong>Lokale: </strong>{modul.aktivitet.lokale}</p>
        <p><strong>Lærer: </strong>{modul.aktivitet.lærer}</p>
        
        <br/>

        {#if lektieHtml != "<p><p/>"}
            <h3 class="text-xl font-bold">Lektier</h3>
            {@html lektieHtml}
            <br/>
        {/if}
        

        {#if øvrigeIndholdHtml != "<p><p/>"}
            <h3 class="text-xl font-bold">Øvrigt indhold</h3>
            {@html øvrigeIndholdHtml}
        {/if}

        {#if lektieHtml == "<p><p/>" && øvrigeIndholdHtml == "<p><p/>"}
            <p>Aktiviteten har ikke noget indhold.</p>
        {/if}
    {/if}
</div>