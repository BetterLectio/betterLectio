<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MessageLink } from '$lib/components/links';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ValueSelect } from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { TextTooltip } from '$lib/components/ui/tooltip';
	import { LECTIO_API } from '$lib/lectio';
	import { authStore, informationStore, messageStore } from '$lib/stores';
	import type { FullMessage, RawFullMessage } from '$lib/types/messages';
	import { decodeUserID, get, relativeTime } from '$lib/utils';
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { test } from 'fuzzy';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Plus from 'lucide-svelte/icons/plus';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import Search from 'lucide-svelte/icons/search';
	import Send from 'lucide-svelte/icons/send';
	import Undo from 'lucide-svelte/icons/undo';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { toast } from 'svelte-sonner';
	import { fade, fly, slide } from 'svelte/transition';
	import { Avatar } from '$lib/components/lectio';

	let selectedMessage: string | null = null;
	$: if (selectedMessage) {
		fetchFullMessage();
	}

	onMount(async () => {
		const params = $page.url.searchParams;
		const messageId = params.get('id');
		if (messageId !== null && messageId != selectedMessage) {
			selectedMessage = messageId;
		}

		await messageStore.fetch();
		await informationStore.fetch();
	});

	$: messages = $messageStore
		? $messageStore.length >= 0 && $messageStore.length > 0 && $messageStore?.[0]?.date // Remove this after some time. Fixes old localStorage message format
			? $messageStore.map((message) => ({
				...message,
				date: DateTime.fromFormat(message.date, 'd/M-yyyy HH:mm', { locale: 'da' })
			}))
			: null
		: null;
	$: me = $informationStore?.students?.find(
		(student) => student.id == `S${decodeUserID($authStore.cookie ?? '0')}`
	);

	let searchTerm = '';
	let currentItems = 30;
	let searchFilter: 'All' | 'Received' | 'Sent' = 'All';
	let searchGroup = '';
	let searchFrom = '';
	let searchTo = '';
	$: searchResettable =
		searchTerm != '' ||
		searchFilter != 'All' ||
		searchFrom != '' ||
		searchTo != '' ||
		searchGroup != '';
	$: filteredMessages = messages
		? messages.filter((message) => {
			if (searchFilter != 'All') {
				if (message.sender == me?.name && searchFilter == 'Received') return false;
				if (message.sender != me?.name && searchFilter == 'Sent') return false;
			}
			if (searchGroup) {
				if (!message.receivers.includes(searchGroup)) return false;
			}
			if (searchFrom) {
				if (DateTime.fromISO(searchFrom).plus({ hours: 2 }) > message.date) return false;
			}
			if (searchTo) {
				if (DateTime.fromISO(searchTo).plus({ hours: 2 }) < message.date) return false;
			}
			return test(searchTerm, message.title);
		})
		: [];

	let fullMessage: FullMessage | null = null;
	let fullMessageLoading: boolean;
	const fetchFullMessage = async () => {
		if (fullMessageLoading || !selectedMessage) return;
		fullMessage = null;
		fullMessageLoading = true;
		const data = (await get(`/besked?id=${selectedMessage}`)) as RawFullMessage | null;
		if (!data) {
			fullMessageLoading = false;
			selectedMessage = null;
			goto('/beskeder', { replaceState: true, keepFocus: true });
			return toast.error('Der skete en fejl under hentning af beskeden.');
		}
		fullMessage = {
			messages: data.beskeder.map((message) => {
				const edits = (message.besked.match(/^.*Redigeret af.*$/gm) ?? []).map((edit: string) =>
					edit.replace(/ .*,/, '')
				);
				const clientParts = message.besked.match(
					/Sendt fra.*\[(.*)\]\((.*)\)|\[Sendt fra (.*)\]\((.*)\)/
				);
				const client = clientParts
					? {
						name: clientParts[1] ?? clientParts[3],
						link: clientParts[2] ?? clientParts[4]
					}
					: undefined;

				return {
					attachments: message.vedhæftninger
						? message.vedhæftninger.map((attachment) => {
							return {
								link: attachment.href,
								name: attachment.navn
							};
						})
						: [],
					date: DateTime.fromFormat(message.dato, 'dd-MM-yyyy HH:mm:ss', {
						locale: 'da'
					}),
					edits,
					client,
					body: message.besked
						.replaceAll('@', '@<!-- -->')
						.replaceAll(/^.*Redigeret af.*$/gm, '')
						.replace(/Sendt fra.*\[(.*)\]\((.*)\)|\[Sendt fra (.*)\]\((.*)\)/, ''),
					sender: {
						id: message.bruger.id,
						name: message.bruger.navn.split(' (')[0].split(' -')[0]
					},
					title: message.titel,
					id: message.id,
					indent: message.padding_left
				};
			}),
			receivers: data.modtagere
		};
		fullMessageLoading = false;
	};

	let replyTo: FullMessage['messages'][0] | null = null;
	let replyContent = '';
	const sendReply = async () => {
		if (!fullMessage) return;
		if (!replyTo) return;
		if (!replyContent) return;

		const res = await fetch(`${LECTIO_API}/besvar_besked`, {
			method: 'POST',
			headers: {
				'lectio-cookie': $authStore.cookie || '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message_id: selectedMessage,
				id: replyTo.id,
				titel: replyTo.title.includes('Re: ') ? replyTo.title : `Re: ${replyTo.title}`,
				content: replyContent
			})
		});
		if (res.status == 200) {
			toast.success('Din besked blev sendt.');
			selectedMessage = selectedMessage + ' ';
		} else {
			toast.error('Din besked kunne ikke blive sendt. Prøv igen senere.');
		}
		replyTo = null;
		replyContent = '';
	};

	const onWindowKeydown = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			if (replyTo) {
				replyTo = null;
			}
		}
	};
	const maybeReply = async (event: KeyboardEvent) => {
		if (event.key == 'Enter') {
			await sendReply();
		}
	};

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible();

	let container: HTMLDivElement;
	let height = 0;
	$: if (height > 0) {
		container.style.height = `${height - 57}px`;
	}

	const removeAllOccurrences = (element: Element, className: string | string[]) => {
		if (Array.isArray(className)) {
			className.forEach((name) => {
				if (element.classList.contains(name)) {
					element.classList.remove(name);
				}
			});
		} else {
			if (element.classList.contains(className)) {
				element.classList.remove(className);
			}
		}
	};

	const addIfMissing = (element: Element, className: string | string[]) => {
		if (Array.isArray(className)) {
			className.forEach((name) => {
				if (!element.classList.contains(name)) {
					element.classList.add(name);
				}
			});
		} else {
			if (!element.classList.contains(className)) {
				element.classList.add(className);
			}
		}
	};

	let sidebar: HTMLDivElement;
	$: if (container && sidebar) {
		if (selectedMessage) {
			removeAllOccurrences(sidebar, 'w-full');
			addIfMissing(sidebar, ['hidden', 'lg:w-[30vw]', 'xl:w-[40rem]', '2xl:w-[60rem]']);
		} else {
			setTimeout(() => {
				removeAllOccurrences(sidebar, ['hidden', 'lg:w-[30vw]', 'xl:w-[40rem]', '2xl:w-[60rem]']);
				addIfMissing(sidebar, 'w-full');
			}, 1000);
		}
	}

	let width = 0;

	function flyOrFade(node: Element) {
		return width > 1024 ? fly(node, { duration: 200, x: '100vw' }) : fade(node, { duration: 100 });
	}

	// get the width of element and apply it to the resp-width is element
	addEventListener('resize', () => {
		calcInputFieldWidth();
	});

	//make a thing that runs every 0.5 seconds
	let interval: number | undefined;
	onMount(() => {
		calcInputFieldWidth();
		interval = setInterval(() => {
			calcInputFieldWidth();
		}, 100);

		() => {
			clearInterval(interval);
		};
	});

	function calcInputFieldWidth() {
		if (!selectedMessage) return;
		width = document.getElementById('w-of-resp-input')?.offsetWidth ?? 0;
		const element = document.getElementById('resp-input');
		if (element) element.style.width = `${width + 28}px`;
	}
</script>

<svelte:window on:keydown={onWindowKeydown} bind:innerWidth={width} bind:innerHeight={height} />

<div bind:this={container} class="lg:!pt-0 flex flex-col lg:flex-row w-full">
	<div bind:this={sidebar} style="transition: width 200ms ease;" class="flex-col w-full lg:flex">
		<header use:melt={$root} class="p-4 border-b dark:border-white/10">
			<div class="flex items-center">
				<button
					use:melt={$trigger}
					disabled={!$messageStore}
					class="flex items-center p-2 rounded-md hover:bg-light-hover dark:hover:bg-dark"
				>
					<h3 class="m-0">Filtre</h3>
					{#if $open}
						<ChevronUp class="ml-1 square-5" />
					{:else}
						<ChevronDown class="ml-1 square-5" />
					{/if}
				</button>
				{#if searchResettable}
					<TextTooltip text="Nulstil alle filtre">
						<button
							on:click={() => {
								searchTerm = '';
								searchFilter = 'All';
								searchGroup = '';
								searchFrom = '';
								searchTo = '';
							}}
							class="flex items-center justify-center"
						>
							<RotateCcw class="ml-2 text-red-500 square-5" />
						</button>
					</TextTooltip>
				{/if}
			</div>
			<div class="relative my-2">
				<div class="absolute h-9 inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
					<Search class="w-5 h-5 text-zinc-500 dark:text-zinc-300" />
				</div>
				<Input
					bind:value={searchTerm}
					autocapitalize="off"
					autocomplete="off"
					autocorrect="off"
					class="pl-10"
					placeholder="Søg..."
					spellcheck="false"
					type="search"
				/>
			</div>
			{#if $open}
				<div use:melt={$content} transition:slide>
					<div class="flex flex-col gap-2">
						<div class="flex flex-row space-x-2">
							<Badge
								on:click={() => {
									searchFilter = 'All';
								}}
								variant={searchFilter == 'All' ? 'default' : 'outline'}
								class="cursor-pointer">Alle
							</Badge
							>
							<Badge
								on:click={() => {
									searchFilter = 'Received';
								}}
								variant={searchFilter == 'Received' ? 'default' : 'outline'}
								class="cursor-pointer">Modtaget
							</Badge
							>
							<Badge
								on:click={() => {
									searchFilter = 'Sent';
								}}
								variant={searchFilter == 'Sent' ? 'default' : 'outline'}
								class="cursor-pointer">Sendt
							</Badge
							>
						</div>
						{#key $informationStore}
							<ValueSelect
								bind:value={searchGroup}
								items={$informationStore?.groups}
								placeholder="Vælg gruppe eller hold"
							/>
						{/key}
					</div>
				</div>
			{/if}
		</header>
		<div class="h-full p-4 space-y-4 overflow-hidden">
			<h3 class="mt-0">Beskeder</h3>
			<div class="h-full space-y-1 overflow-y-auto">
				{#if messages}
					{#if filteredMessages.length}
						{#each filteredMessages.slice(0, currentItems) as message}
							<div
								class="relative flex flex-row items-center py-4 md:px-4 cursor-pointer rounded-md transition-colors hover:bg-zinc-200 dark:hover:bg-dark-2 {selectedMessage ===
								message.id
									? 'bg-zinc-200 dark:bg-dark-2'
									: ''}"
								on:click={() => {
									if (selectedMessage == message.id) return;
									fullMessage = null;
									replyTo = null;
									replyContent = '';
									selectedMessage = message.id;
									goto(`/beskeder?id=${selectedMessage}`, {
										replaceState: true,
										keepFocus: true
									});
								}}
								on:keydown={() => {}}
								role="button"
								tabindex="0"
							>
								{#key $informationStore}
									<Avatar
										id={$informationStore?.students.find(
											(student) => student.name == message.sender
										)?.id ?? '123'}
										navn={message.sender}
									/>
								{/key}
								<div class="flex items-start justify-between w-full gap-2">
									<div class="flex flex-col flex-grow ml-3">
										<div class="text-sm font-medium">{message.title}</div>
										<div class="text-xs truncate">{message.sender}</div>
									</div>
									{#if !selectedMessage}
										<div
											use:relativeTime={message.date.toJSDate()}
											class="text-xs opacity-35 text-nowrap"
										/>
									{/if}
								</div>
							</div>
							<Separator class="my-2" />
						{/each}
						{#if filteredMessages.length > currentItems}
							<div class="flex items-center justify-center pb-10">
								<Button
									on:click={() => {
										currentItems += 30;
									}}
									variant="secondary"
								>
									Vis flere ({filteredMessages.length - currentItems})
								</Button>
							</div>
						{/if}
					{:else}
						<div class="flex items-center justify-center">
							<div class="flex flex-col">
								Ingen resultater
								{#if searchResettable}
									<Button
										on:click={() => {
											searchTerm = '';
											searchFilter = 'All';
											searchGroup = '';
											searchFrom = '';
											searchTo = '';
										}}
										variant="destructive"
									>
										Nulstil filtre
									</Button>
								{/if}
							</div>
						</div>
					{/if}
				{:else}
					<div class="relative flex flex-row items-center p-4">
						<Skeleton class="absolute top-0 right-0 w-12 h-4 mt-4 mr-4" />
						<Skeleton class="w-10 h-10 rounded-full" />
						<div class="flex flex-col flex-grow ml-3 space-y-2">
							<Skeleton class="w-24 h-6" />
							<Skeleton class="w-24 h-4" />
						</div>
					</div>
					<div class="relative flex flex-row items-center p-4">
						<Skeleton class="absolute top-0 right-0 w-12 h-4 mt-4 mr-4" />
						<Skeleton class="w-10 h-10 rounded-full" />
						<div class="flex flex-col flex-grow ml-3 space-y-2">
							<Skeleton class="w-24 h-6" />
							<Skeleton class="w-24 h-4" />
						</div>
					</div>
					<div class="relative flex flex-row items-center p-4">
						<Skeleton class="absolute top-0 right-0 w-12 h-4 mt-4 mr-4" />
						<Skeleton class="w-10 h-10 rounded-full" />
						<div class="flex flex-col flex-grow ml-3 space-y-2">
							<Skeleton class="w-24 h-6" />
							<Skeleton class="w-24 h-4" />
						</div>
					</div>
					<div class="relative flex flex-row items-center p-4">
						<Skeleton class="absolute top-0 right-0 w-12 h-4 mt-4 mr-4" />
						<Skeleton class="w-10 h-10 rounded-full" />
						<div class="flex flex-col flex-grow ml-3 space-y-2">
							<Skeleton class="w-24 h-6" />
							<Skeleton class="w-24 h-4" />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	{#if selectedMessage}
		<div
			class="flex flex-col w-screen space-y-4 overflow-hidden lg:border-l lg:w-full"
			transition:flyOrFade
		>
			<section class="w-full pb-0">
				<div class="flex items-center w-full p-3 py-3">
					{#if fullMessage}
						<Button
							variant="secondary"
							size="icon"
							on:click={() => {
								fullMessage = null;
								selectedMessage = null;
								goto('/beskeder', { replaceState: true, keepFocus: true });
								replyTo = null;
								replyContent = '';
							}}
						>
							<Undo />
						</Button>
						<div class="flex items-center flex-1 min-w-0">
							<div class="flex flex-col min-w-0 ml-3">
								<span class="font-semibold leading-5 line-clamp-1"
								>{fullMessage.messages[0].title}</span
								>
								<TextTooltip text={fullMessage.receivers} class="text-xs text-gray-400 truncate">
									{fullMessage.receivers}
								</TextTooltip>
							</div>
						</div>
					{:else}
						<Skeleton class="w-10 h-10" />
						<Skeleton class="w-1/2 h-10 ml-3" />
					{/if}
				</div>
				<Separator />
			</section>
			<section class="h-full p-4 py-0 overflow-y-hidden not-prose">
				<div class="h-full space-y-4 overflow-y-auto pb-28">
					<div
						class="w-full"
						id="w-of-resp-input"
						on:change={() => {
							calcInputFieldWidth();
						}}
					></div>
					{#if fullMessage}
						{#each fullMessage.messages as message}
							{#if message.sender.name === me?.name}
								<div
									style={`margin-left: calc(3rem + ${message.indent}rem);`}
									class="grid grid-cols-[1fr_auto] gap-2"
								>
									<!-- 3 rem = 0.5 rem for gap-2 + 2.5 rem for missing avatar -->
									<button
										on:click={() => {
											replyTo = message;
										}}
										class="p-2 space-y-2 transition-colors rounded-md sm:rounded-tr-none bg-primary hover:bg-zinc-800 dark:hover:bg-zinc-200 text-primary-foreground"
									>
										<div class="flex justify-end w-full gap-2">
											<header
												class="flex flex-col w-full items-end justify-start md:flex-row-reverse md:items-center md:justify-between *:text-right"
											>
												<p class="font-bold">{message.title}</p>
												<small class="opacity-50" use:relativeTime={message.date.toJSDate()} />
											</header>
											<TextTooltip text={message.sender.name} class="size-10 sm:hidden">
												{#key $informationStore}
													<Avatar id={message.sender.id} navn={message.sender.name} />
												{/key}
											</TextTooltip>
										</div>
										<div class="flex flex-col">
											{#if message.attachments.length}
												<div class="flex flex-row flex-wrap gap-1">
													{#each message.attachments as attachment}
														<Badge target="_blank" href={attachment.link}>{attachment.name}</Badge>
													{/each}
												</div>
											{/if}
											<div class="text-left">
												<SvelteMarkdown source={message.body} renderers={{ link: MessageLink }} />
											</div>
											{#if message.edits.length}
												{#each message.edits as edit}
													<div class="flex items-center text-gray-400">
														<p class="text-sm">{edit}</p>
														<Pencil class="ml-1 size-4" />
													</div>
												{/each}
											{/if}
											{#if message.client}
												<div class="flex items-center text-gray-400">
													<a target="_blank" href={message.client.link} class="text-sm"
													>Sendt fra {message.client.name}</a
													>
													<ExternalLink class="ml-1 size-4" />
												</div>
											{/if}
										</div>
									</button>
									<TextTooltip text={message.sender.name} class="hidden size-10 sm:inline-flex">
										{#key $informationStore}
											<Avatar id={message.sender.id} navn={message.sender.name} />
										{/key}
									</TextTooltip>
								</div>
							{:else}
								<div
									style={`margin-left: ${message.indent}rem;`}
									class="grid grid-cols-[auto_1fr] gap-2"
								>
									<TextTooltip text={message.sender.name} class="hidden size-10 sm:inline-flex">
										<Avatar id={message.sender.id} navn={message.sender.name} />
									</TextTooltip>
									<button
										on:click={() => {
											replyTo = message;
										}}
										class="p-2 space-y-2 transition-colors border rounded-md sm:rounded-tl-none hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-dark-2"
									>
										<div class="flex justify-start w-full gap-2">
											<TextTooltip text={message.sender.name} class="size-10 sm:hidden">
												{#key $informationStore}
													<Avatar id={message.sender.id} navn={message.sender.name} />
												{/key}
											</TextTooltip>
											<header
												class="flex flex-col w-full items-start justify-start md:flex-row md:items-center md:justify-between *:text-left"
											>
												<p class="font-bold">{message.title}</p>
												<small class="opacity-50" use:relativeTime={message.date.toJSDate()} />
											</header>
										</div>
										<div class="flex flex-col">
											{#if message.attachments.length}
												<div class="flex flex-row flex-wrap gap-1">
													{#each message.attachments as attachment}
														<Badge target="_blank" href={attachment.link}>{attachment.name}</Badge>
													{/each}
												</div>
											{/if}
											<div class="text-left break-words">
												<SvelteMarkdown source={message.body} renderers={{ link: MessageLink }} />
											</div>
											{#if message.edits.length}
												{#each message.edits as edit}
													<div class="flex items-center text-gray-400">
														<p class="text-sm">{edit}</p>
														<Pencil class="ml-1 size-4" />
													</div>
												{/each}
											{/if}
											{#if message.client}
												<div class="flex items-center text-gray-400">
													<a target="_blank" href={message.client.link} class="text-sm"
													>Sendt fra {message.client.name}</a
													>
													<ExternalLink class="ml-1 size-4" />
												</div>
											{/if}
										</div>
									</button>
								</div>
							{/if}
						{/each}
					{/if}
				</div>
			</section>
			<section class="fixed bottom-0 p-3" id="resp-input">
				{#if replyTo}
					<div
						class="flex flex-row items-center justify-between px-3 py-1 rounded-t-lg bg-zinc-100 dark:bg-dark-1 not-prose"
					>
						<p class="text-sm">Svarer <span class="font-bold">{replyTo.sender.name}</span></p>
						<button
							on:click={() => {
								replyTo = null;
								replyContent = '';
							}}
							class="flex items-center justify-center"
						>
							<Plus class="rotate-45" />
						</button>
					</div>
				{/if}
				<div
					class="grid grid-cols-[1fr_auto] overflow-hidden rounded-md {replyTo
						? 'rounded-t-none'
						: ''} bg-white dark:bg-dark-2"
				>
					<input
						bind:value={replyContent}
						on:keydown={maybeReply}
						disabled={!fullMessage || !replyTo}
						class="px-3 py-3 leading-5 bg-transparent border-0 ring-0 disabled:cursor-not-allowed"
						name="message"
						id="message"
						placeholder={replyTo ? 'Skriv din besked...' : 'Vælg en besked...'}
					/>
					<button
						disabled={!fullMessage || !replyTo}
						on:click={sendReply}
						class="flex items-center content-between px-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed"
					>
						<Send />
					</button>
				</div>
			</section>
		</div>
	{/if}
</div>
