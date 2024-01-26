<script lang="ts">
    import { api, get } from '$lib/js/http.js';
	import LectioAvatar from '$lib/customComponents/LectioAvatar.svelte';
	import MarkdownIt from 'markdown-it';
	import purifier from 'dompurify';

    const { sanitize } = purifier;
    const md = new MarkdownIt();

    const beskedId = new URLSearchParams(window.location.search).get('id');

    let beskedChain = null;
    let beskedModtagere = null;

    get(`/besked?id=${beskedId}`).then((res) => {
        beskedChain = res.beskeder;
        beskedModtagere = res.modtagere;
        console.log(res);
    });
    
</script>

