<script lang="ts">
    import * as Alert from '$lib/components/ui/alert';
    import { Button } from '$lib/components/ui/button';
    import { LightningBolt } from 'radix-icons-svelte';

    export let state: string;
</script>

<Alert.Root class="pt-4">
    <LightningBolt />
    <div class="flex items-center justify-between w-full">
        <div>
            <Alert.Title>Synkronisering af opgaver</Alert.Title>
            <Alert.Description>Automatisk synkroniser dine opgaver til Google Tasks</Alert.Description>
        </div>
        <Button on:click={() => alert('Denne feature er ikke implementeret')}>Synkroniser nu</Button>
    </div>
</Alert.Root>