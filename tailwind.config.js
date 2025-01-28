/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Noto Sans Display', 'sans-serif'],
			},
			fontWeight: {
				thin: 100,
				extralight: 200,
				light: 300,
				normal: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
				extrabold: 800,
				black: 900,
			},
			colors: {
				//useing the colors ex. className={"bg-charcoal"}
				charcoal: "var(--charcoal)",
				charcoalTransparent: "var(--charcoal-transparent)",
				charcoalLight: "var(--charcoal-light)",
				egg: "var(--egg)",
				ruby: "var(--ruby)",
				ash: "var(--ash)",
				ashyEgg: "var(--ashy-egg)",
				snow: "var(--snow)",
			},
			height: {
				"30vw": "30vw",
				"40vw": "40vw",
				"50vw": "50vw",
				"65vw": "65vw",
				"70vw": "70vw",
				"90vw": "90vw",
			},
			boxShadow: {
				"inner-lg": "inset 0 4px 8px rgba(0, 0, 0, 0.3)", // Large inner shadow
				"inner-sm": "inset 0 2px 4px rgba(0, 0, 0, 0.2)", // Small inner shadow
				'layered': '0px 4px 6px rgba(0, 0, 0, 0.5)'
			},
			spacing:{
				"largerScreenH" : "120vh",
				"largest": "2500px",
				"secondLargest": "1800px",
				"thirdLargest": "1300px"

			},
			screens: {
				mobile: { min: "400px", max: "640px" },
				"custom-md-lg": { min: "1024px", max: "1224px" },
				"custom-md": { min: "1024px", max: "1410px" },
			}
		},
	},
	plugins: [],
};
