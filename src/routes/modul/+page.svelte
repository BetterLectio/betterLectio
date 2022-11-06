<script>
    import { page } from '$app/stores';
    
    const absid = $page.url.searchParams.get('absid');
</script>

<div>
    <p>Modul id: {absid}</p>
</div>