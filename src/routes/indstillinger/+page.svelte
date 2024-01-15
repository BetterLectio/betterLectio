<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft as Back, ExclamationTriangle, Check, CaretSort } from 'radix-icons-svelte';
	import AccountSheet from '$lib/customComponents/AccountSheet.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { tick } from 'svelte';
    import { get } from '$lib/js/http';
    import { banners } from '$lib/js/store';
	import { isAuthed } from '$lib/js/store';
    banners ?? [];

    let showAccountError = !checkIfCredentialsAreSet();

    function checkIfCredentialsAreSet() {
        const credentials = localStorage.getItem('credentials');
        if(credentials === null) return false;
        const {username, password, schoolId} = JSON.parse(credentials);
        if(username === undefined || password === undefined || schoolId === undefined) return false;
        if(username === '' || password === '' || schoolId === '') return false;
        
        if($banners.find((banner: any) => banner.text === 'BetterLectio mangler dine login oplysninger')) {
            $banners = $banners.filter((banner: any) => banner.text !== 'BetterLectio mangler dine login oplysninger');
        } 
        return true;
    }

</script>

<div class="container mx-auto flex items-center gap-4">
	<Back class="w-8 h-8 " />
	<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Indstillinger</h3>
</div>
<Separator class="mb-4 mt-1" />
<div class="container mx-auto">
	<h3 class="scroll-m-20 text-lg font-semibold">Lectio Konto</h3>
    {#if showAccountError}
         <!-- content here -->
         <Alert.Root variant="destructive">
             <ExclamationTriangle class="h-4 w-4" />
             <Alert.Title>Konto Fejl</Alert.Title>
             <Alert.Description>
                 Din lectio konto er ikke sat op. Du kan ikke bruge BetterLectio uden at have sat din lectio
                 konto op.
             </Alert.Description>
         </Alert.Root>
    {/if}
	<p>BetterLectio bruger din lectio konto til at hente dine data fra lectio.</p>
	<AccountSheet />
</div>
<Separator class="my-4" />