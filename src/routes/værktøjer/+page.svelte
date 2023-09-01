<script>
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	let cookie = null;
	let indhold = null;
	cookieInfo().then(data => {
		cookie = data;
		indhold = {
			BetterLectio: [
				{
					title: 'Hvornår har jeg fri?',
					link: '/værktøjer/fri',
					description: 'Viser dig hvornår du har fri',
					status: ''
				},
				{
					title: 'Elevliste',
					link: '/værktøjer/elever',
					description: 'Viser dig en liste over alle elever',
					status: ''
				},
				{
					title: 'Find ledige lokaler',
					link: '/værktøjer/ledigelokaler',
					description: 'Viser dig en liste over alle ledige lokaler',
					status: ''
				},
				{
					title: 'Eksamener',
					link: '/værktøjer/eksamener',
					description: 'Se hvilke eksamener du har foran dig',
					status: 'BETA'
				},
				{
					title: 'Kantine',
					link: '/værktøjer/kantine',
					description: 'Se hvad der er i kantinen',
					status: 'BETA'
				},
				{
					title: 'Fravær regner',
					link: '/værktøjer/fravær',
					description: 'Find ud af, hvor mange moduler du kan pjække',
					status: 'BETA'
				},
				{
					title: 'Google Kalender-synkronisering',
					link: '/værktøjer/googlecalsync',
					description: 'Synkroniser dine moduler med din google kalender',
					status: 'BETA'
				}
			],
			'Lectio (vi arbejder på at flytte disse sider til BetterLectio)': [
				{
					title: 'Bøger',
					link: `https://www.lectio.dk/lectio/${cookie.schoolId}/BD/UserReservations.aspx?ElevID=${cookie.userId}`,
					newTab: true,
					description: 'Viser dig dine bøger',
					status: 'WIP'
				},
				{
					title: 'Spørgeskema',
					link: `https://www.lectio.dk/lectio/${cookie.schoolId}/spoergeskema/spoergeskema_rapport.aspx?type=mine&elevid=${cookie.userId}`,
					newTab: true,
					description: 'Viser dig dine spørgeskemaer',
					status: 'WIP'
				}
			],
			Eksterne: [
				{
					title: 'Konverter din matematikopgave til et valgfrit format',
					link: 'https://www.asguho.dk/mathformatter',
					newTab: true,
					description: 'Konverter din matematikopgave til et valgfrit format',
					status: 'BETA'
				}
			]
		};
	});
</script>

{#if cookie}
	{#each Object.entries(indhold) as [sectionTitel, elements]}
		<ul class="list mb-4">
			<h1 class="heading">{sectionTitel}</h1>
			{#each elements as element}
				<a class="flex-row" href={element.link} target={element.newTab ? '_blank' : ''}>
					<li class="element flex border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
						{#if element.status}
							<span part="afsender" class="btn-xs btn mr-4 w-fit">{element.status}</span>
						{/if}
						<span part="emne" class="text-lg font-bold">{element.title}</span>
						<!-- <span part="emne" class="text-sm font-bold">{element.description}</span> -->
					</li>
				</a>
			{/each}
		</ul>
	{/each}
{/if}
