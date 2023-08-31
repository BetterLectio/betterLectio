/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			height: {
				'10v': '10vh',
				'20v': '20vh',
				'30v': '30vh',
				'40v': '40vh',
				'50v': '50vh',
				'60v': '60vh',
				'70v': '70vh',
				'80v': '80vh',
				'90v': '90vh',
				'100v': '100vh'
			},
			scale: { 99: '0.99' },
			keyframes: {
				'fade-in-down': {
					'0%': {
						opacity: '0',
						transform: 'translateY(-10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					wiggle: {
						'0%, 100%': { transform: 'rotate(-10deg)' },
						'50%': { transform: 'rotate(10deg)' }
					}
				}
			},
			animation: {
				'fade-in-down': 'fade-in-down 0.5s ease-out',
				wiggle: 'wiggle 1.5s ease-in-out infinite'
			}
		},
		container: {
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem'
			}
		},
		backgroundImage: { 'navbar-line': 'radial-gradient(62.87% 100% at 50% 100%, hsl(var(--bc) / 0.2) 0%, hsl(0, 0%, 0%, 0) 100%)' }
	},
	daisyui: {
		themes: [
			'light',
			'garden',
			'dark',
			'dracula',
			'night',
			'lemonade',
			{
				lectio: {
					primary: '#1b5c9e',
					secondary: '#1b5c9e',
					accent: '#B20C00',
					neutral: '#b8c3cc',
					'base-100': '#fff',
					info: '#53C0F3',
					success: '#339900',
					warning: '#F3CC30',
					error: '#B20C00'
				},
				business: {
					'color-scheme': 'dark',
					primary: '#254c73',
					secondary: '#7C909A',
					accent: '#EA6947',
					neutral: '#23282E',
					'base-100': '#272a2b',
					info: '#56A1D6',
					success: '#65BF89',
					warning: '#DBAE59',
					error: '#AC3E31'
				},
				valentine: {
					'color-scheme': 'light',
					primary: '#e96d7b',
					secondary: '#a991f7',
					accent: '#88dbdd',
					neutral: '#af4670',
					'neutral-content': '#f0d6e8',
					'base-100': '#f0d6e8',
					'base-content': '#632c3b',
					info: '#2563eb',
					success: '#16a34a',
					warning: '#d97706',
					error: '#dc2626'
				}
			}
		]
	},
	// eslint-disable-next-line global-require
	plugins: [require('daisyui'), require('@tailwindcss/forms')]
};
