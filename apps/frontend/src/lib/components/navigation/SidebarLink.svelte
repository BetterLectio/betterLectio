<script lang="ts">
	import { page } from '$app/stores';
	import { sidebarStore } from '$lib/stores';
	import BarChart3 from 'lucide-svelte/icons/bar-chart-3';
	import CalendarDays from 'lucide-svelte/icons/calendar-days';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import Home from 'lucide-svelte/icons/home';
	import ListTodo from 'lucide-svelte/icons/list-todo';
	import Mail from 'lucide-svelte/icons/mail';
	import BookOpenCheck from 'lucide-svelte/icons/book-open-check';

	const icons = {
		home: Home,
		schedule: CalendarDays,
		assignments: ListTodo,
		messages: Mail,
		absence: BarChart3,
		grades: BookOpenCheck,
		default: CircleHelp
	};

	let rawIcon: string = 'default';
	export { rawIcon as icon };
	export let href: string;
	export let label: string;

	// @ts-ignore
	$: icon = icons[rawIcon] ?? icons.default;
	$: active = href === decodeURI($page.url.pathname);
</script>

<a
	{href}
	class="block unstyled {$sidebarStore.isOpen
		? 'w-full rounded-r-3xl'
		: 'w-10 ml-4 rounded-3xl'} transition-[border-radius,margin,width] {active
		? 'bg-primary text-white dark:text-black'
		: 'hover:bg-muted'} cursor-pointer"
	on:click
	on:keydown
>
	<div class="flex items-center h-10">
		<div class="shrink-0 {$sidebarStore.isOpen ? 'px-6' : 'px-2'} transition-[padding]">
			<svelte:component this={icon} class="{active && 'text-white dark:text-black'} size-6" />
		</div>
		<div class="flex flex-1 overflow-hidden leading-[20px]">
			<span
				class="{$sidebarStore.isOpen
					? 'overflow-visible'
					: 'overflow-hidden'} cursor-pointer text-ellipsis text-nowrap"
			>
				{label}
			</span>
		</div>
	</div>
</a>
