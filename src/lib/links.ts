export const SITE_LINKS = {
    main: {
        label: 'Forslag',
        links: [
            { href: '/home', label: 'Forside', icon: 'home' },
            { href: '/skema', label: 'Skema', icon: 'schedule' },
            { href: '/opgaver', label: 'Opgaver', icon: 'assignments' },
            { href: '/beskeder', label: 'Beskeder', icon: 'messages' },
            { href: '/', label: 'Fravær', icon: 'absence' },
        ]
    },
    absence: {
        label: 'Fravær',
        links: [
            { href: '/', label: 'Fraværsoversigt' },
            { href: '/', label: 'Fraværsårsager' },
            { href: '/', label: 'Fraværsregner' },
        ]
    },
    other: {
        label: 'Andet',
        links: [{ href: '/indstillinger', label: 'Indstillinger' }]
    }
}
