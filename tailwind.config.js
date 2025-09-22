/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'animate-pulse',
    'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]',
    {
      pattern: /animate-(in|out)/,
    },
    {
      pattern: /framer-motion-/,
    },
  ],
  theme: {
    extend: {
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
