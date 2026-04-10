import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { ink: '#0a0a0a', paper: '#f8f6f1', muted: '#8a8a8a' },
      fontFamily: { display: ['Playfair Display', 'serif'], body: ['DM Sans', 'sans-serif'], label: ['Syne', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
