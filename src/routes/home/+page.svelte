<script lang="ts">
	import { NewTabLink, Spinner } from '$lib/components';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { frontPageStore } from '$lib/stores';
	import type { Lesson, RawLesson } from '$lib/types/lesson';
	import type { RawSimpleMessage } from '$lib/types/messages';
	import type { RawNews } from '$lib/types/news';
	import { constructInterval, get, relativeTime, stringToColor, toTitleCase } from '$lib/utils';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Clock from 'lucide-svelte/icons/clock';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import { DateTime, Interval } from 'luxon';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';

	onMount(async () => {
		const data = (await get('/forside')) as {
			skema: RawLesson[];
			aktuelt: RawNews[];
			undervisning: { opgaveaflevering: { id: string; dato: string; navn: string }[] };
			kommunikation: {
				beskeder: RawSimpleMessage[];
			};
		};

		$frontPageStore = {
			lessons: data.skema.map((lesson) => {
				return {
					color: stringToColor(lesson.hold ?? '', 100, 90).string,
					class: lesson.hold ?? '',
					id: lesson.absid,
					date: lesson.tidspunkt,
					name:
						lesson.navn
							?.replace('prv.', 'prøve')
							.replace('mdt.', 'mundtlig')
							.replace('skr.', 'skriftlig') ?? '',
					note: lesson.andet ?? '',
					room: lesson.lokale ?? '',
					status: lesson.status ?? '',
					teacher: lesson.lærer ?? ''
				};
			}),
			assignments: data.undervisning.opgaveaflevering.map((assignment) => {
				return {
					id: +assignment.id,
					name: assignment.navn,
					date: assignment.dato
				};
			}),
			messages: data.kommunikation.beskeder.map((message) => {
				return {
					date: message.dato,
					id: +message.id,
					sender: message.afsender,
					title: message.navn
				};
			}),
			news: data.aktuelt.map((item) => {
				return {
					description: item.text.replaceAll('@', '@<!-- -->') // Without this, emails get obfuscated with random hex characters. https://github.com/github/markup/issues/1168
				};
			})
		};
	});

	$: nextClass =
		$frontPageStore && $frontPageStore.lessons && $frontPageStore.lessons.length > 0
			? {
					...$frontPageStore.lessons[0],
					interval: constructInterval($frontPageStore.lessons[0].date)
				}
			: null;
	$: classes = $frontPageStore
		? ($frontPageStore.lessons || []).reduce<
				{ name: string; lessons: (Lesson & { interval: Interval })[] }[]
			>((acc, lesson) => {
				const interval = constructInterval(lesson.date);
				const dayName = interval.start?.hasSame(DateTime.now(), 'day')
					? 'I dag'
					: interval.start?.hasSame(DateTime.now().plus({ days: 1 }), 'day')
						? 'I morgen'
						: toTitleCase(interval.start?.toFormat('EEEE d/M') ?? 'N/A');
				if (acc.find((day) => day.name === dayName))
					acc[acc.findIndex((day) => day.name === dayName)].lessons.push({ ...lesson, interval });
				else acc.push({ name: dayName, lessons: [{ ...lesson, interval }] });
				return acc;
			}, [])
		: null;
	$: assignments = $frontPageStore
		? ($frontPageStore.assignments || []).map((assignment) => {
				return {
					...assignment,
					date: DateTime.fromFormat(assignment.date, 'd/M-yyyy HH:mm', {
						locale: 'da'
					})
				};
			})
		: null;
	$: messages = $frontPageStore
		? ($frontPageStore.messages || []).map((message) => {
				return {
					...message,
					date: DateTime.fromFormat(message.date, 'd/M-yyyy HH:mm', {
						locale: 'da'
					})
				};
			})
		: null;
	$: news = $frontPageStore ? $frontPageStore.news : [];
</script>

<div class="page-container">
	<h1>Forside - {DateTime.now().toLocaleString()}</h1>
	<div class="flex flex-col gap-4 lg:min-w-0 lg:flex-1 lg:flex-row !mt-3">
		<div class="flex flex-col gap-4 lg:shrink-0 lg:w-1/3">
			<Card class="p-2 border-2 lg:max-h-[70vh] overflow-auto">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-medium unstyled">Næste Modul</h2>
					{#if !nextClass}
						<Spinner />
					{:else}
						<Badge>{nextClass?.room}</Badge>
					{/if}
				</div>
				{#if nextClass}
					<div class="flex flex-col mt-1">
						<p>{nextClass.class}</p>
						<p>{nextClass.name}</p>
						<p class="mt-1 text-sm text-muted-foreground">
							begynder {nextClass.interval.start?.toRelative()}
						</p>
					</div>
				{/if}
			</Card>
			<Card class="p-2 border-2 lg:max-h-[70vh] overflow-auto">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-medium unstyled">Opgaver</h2>
					{#if !assignments}
						<Spinner />
					{/if}
				</div>
				{#if assignments}
					{#if assignments.length > 0}
						<div class="space-y-2">
							{#each assignments as assignment}
								<a
									href={`/opgave?id=${assignment.id}`}
									class="flex flex-col p-3 border rounded-md shadow dark:bg-dark-2 bg-card unstyled"
								>
									<p class="overflow-hidden whitespace-nowrap text-ellipsis">{assignment.name}</p>
									<p
										use:relativeTime={assignment.date.toJSDate()}
										class="text-sm text-muted-foreground"
									/>
								</a>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-muted-foreground">Ingen kommende opgaver.</p>
					{/if}
				{/if}
			</Card>
			<Card class="p-2 border-2 lg:max-h-[70vh] overflow-auto">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-medium unstyled">Beskeder</h2>
					{#if !messages}
						<Spinner />
					{/if}
				</div>
				{#if messages}
					{#if messages.length > 0}
						<div class="space-y-2">
							{#each messages as message}
								<a
									href={`/besked?absid=${message.id}`}
									class="flex flex-col p-3 border rounded-md shadow dark:bg-dark-2 bg-card unstyled"
								>
									<p class="overflow-hidden whitespace-nowrap text-ellipsis">{message.title}</p>
									<p
										class="overflow-hidden text-sm text-muted-foreground whitespace-nowrap text-ellipsis"
									>
										{message.sender}
									</p>
								</a>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-muted-foreground">Ingen ulæste beskeder.</p>
					{/if}
				{/if}
			</Card>
		</div>
		<div class="flex flex-col gap-4">
			<Card class="p-2 border-2 lg:max-h-[50vh] overflow-auto">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-medium unstyled">Skema</h2>
					{#if !classes}
						<Spinner />
					{/if}
				</div>
				{#if classes}
					<div class="space-y-2">
						{#each classes as day}
							<h3 class="text-sm font-medium leading-7 unstyled">{day.name}</h3>
							{#each day.lessons as lesson}
								<Card level="2" class="flex items-center p-3" error={lesson.status === 'aflyst'}>
									<div class="flex items-center flex-1 h-full min-w-0">
										<div class="flex justify-center shrink-0 w-11">
											<span class="text-lg font-medium"
												>{lesson.interval.start?.toFormat('HH:mm')}</span
											>
										</div>
										<Separator orientation="vertical" class="h-10 mx-3" />
										<div class="flex flex-col w-28 shrink-0">
											<div class="flex items-center">
												<Clock class="mr-1 size-3" />
												<p class="text-sm">{lesson.interval.toFormat('HH:mm')}</p>
											</div>
											<div class="flex items-center">
												<MapPin class="mr-1 size-3" />
												<p class="text-sm">{lesson.room}</p>
											</div>
										</div>
										<div class="flex flex-col min-w-0">
											<p class="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap">
												{lesson.name ?? lesson.class}
											</p>
											<p
												class="overflow-hidden text-sm whitespace-nowrap text-muted-foreground overflow-ellipsis"
											>
												{lesson.teacher}
											</p>
										</div>
									</div>
									<Button href={`/modul?absid=${lesson.id}`} variant="ghost" size="sm">
										Vis <ArrowRight class="ml-1 size-4" />
									</Button>
								</Card>
							{/each}
						{/each}
					</div>
				{/if}
			</Card>
			<Card class="p-2 border-2 lg:max-h-[50vh] overflow-auto">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-medium unstyled">Aktuelt</h2>
					{#if !news}
						<Spinner />
					{/if}
				</div>
				{#if news && news.length > 0}
					<div class="space-y-2">
						{#each news as item, i}
							<SvelteMarkdown source={item.description} renderers={{ link: NewTabLink }} />
							{#if i != news.length - 1}
								<hr class="!my-4 dark:border-t-gray-600/50" />
							{/if}
						{/each}
					</div>
				{:else}
					<p>Ingen aktuelle nyheder.</p>
				{/if}
			</Card>
		</div>
	</div>
</div>
