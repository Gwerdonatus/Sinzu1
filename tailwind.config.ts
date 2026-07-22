import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sinzu: { gold: '#C9A227', goldLight: '#D4AF37', goldDark: '#B8941F', cream: '#F5E6C8' }
      },
      fontFamily: { serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'] },
    },
  },
  plugins: [],
}
export default config
