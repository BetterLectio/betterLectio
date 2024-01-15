<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft as Back } from 'radix-icons-svelte';
	import * as Table from '$lib/components/ui/table';
    import { get } from '$lib/js/http';
    import { opgaver } from '$lib/js/store';

    opgaver ?? [];
    get('/opgaver').then((res) => {
        $opgaver = res;
    });
</script>

<div class="container mx-auto flex items-center gap-4">
	<Back class="w-8 h-8 " />
	<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Opgaver</h3>
</div>
<Separator class="mb-4 mt-1" />
<div class="container mx-auto">
    <Table.Root>
        <Table.Caption>A list of your recent invoices.</Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head>Hold</Table.Head>
                <Table.Head>fravær</Table.Head>
                <Table.Head>frist</Table.Head>
                <Table.Head>opgavetitel</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each $opgaver as opgave}
                <Table.Row>
                    <Table.Cell>{opgave.hold}</Table.Cell>
                    <Table.Cell>{opgave.fravær}</Table.Cell>
                    <Table.Cell>{opgave.frist}</Table.Cell>
                    <Table.Cell>{opgave.opgavetitel}</Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
