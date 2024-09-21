/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			transitionTimingFunction: {
				'spring-soft': 'cubic-bezier(0.5, 0, 0.5, 1.5)',
				'spring-medium': 'cubic-bezier(0.5, 0, 0.1, 1.5)',
				'spring-hard': 'cubic-bezier(0.5, -0.5, 0.1, 1.5)',
			},
		},
	},
	plugins: [
		require('tailwindcss/plugin')(({ addUtilities }) => {
			addUtilities({
				'.transition-spring-soft': {
					'transition-timing-function': 'cubic-bezier(0.5, 0, 0.5, 1.5)',
				},
				'.transition-spring-medium': {
					'transition-timing-function': 'cubic-bezier(0.5, 0, 0.1, 1.5)',
				},
				'.transition-spring-hard': {
					'transition-timing-function': 'cubic-bezier(0.5, -0.5, 0.1, 1.5)',
				},
			})
		}),
	],
}
