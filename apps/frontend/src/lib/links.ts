export const SITE_LINKS = {
	main: {
		label: "Forslag",
		links: [
			{ href: "/home", label: "Forside", icon: "home" },
			{ href: "/skema", label: "Skema", icon: "schedule" },
			{ href: "/opgaver", label: "Opgaver", icon: "assignments" },
			{ href: "/beskeder", label: "Beskeder", icon: "messages" },
			{ href: "/fravær", label: "Fravær", icon: "absence" },
			{ href: "/karakterer", label: "Karakterer", icon: "grades" },
			{ href: "/lektier", label: "Lektier", icon: "homework" },
			{ href: "/lokaler", label: "Lokaler", icon: "freeRooms" },
			{ href: "/elever", label: "Elever", icon: "user" },
		],
	},
	absence: {
		label: "Fravær",
		links: [
			{ href: "/fravær", label: "Fraværsoversigt" },
			{ href: "/fravær", label: "Fraværsårsager" },
			// { href: '/fravær', label: 'Fraværsregner' }
		],
	},
	other: {
		label: "Andet",
		links: [
			{ href: "/indstillinger", label: "Google Synkronisering" },
			{ href: "/indstillinger", label: "Indstillinger" },
		],
	},
};
