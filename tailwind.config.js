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
      colors: {
        light: {
          background: '#ffffff',
          primary: '#0f172a',
          secondary: '#f1f5f9',
          accent: '#3b82f6',
          'secondary-accent': '#64748b',
          'text-primary': '#0f172a',
          'text-secondary': '#475569',
        },
        dark: {
          background: '#0f172a',
          primary: '#1e293b',
          secondary: '#334155',
          accent: '#60a5fa',
          'secondary-accent': '#94a3b8',
          'text-primary': '#f1f5f9',
          'text-secondary': '#cbd5e1',
        },
        cyberpunk: {
          background: '#0a0a0a',
          primary: '#1a1a1a',
          accent: '#00ffff',
          'secondary-accent': '#8a2be2',
          'text-primary': '#ffffff',
          'text-secondary': '#f0f0f0',
        },
        'neon-blue': {
          background: '#000000',
          primary: '#0a0a0a',
          accent: '#00ffff',
          'secondary-accent': '#1e40af',
          'text-primary': '#ffffff',
          'text-secondary': '#93c5fd',
        },
        'purple-glow': {
          background: '#0f0a1a',
          primary: '#1a0a2e',
          accent: '#a855f7',
          'secondary-accent': '#8a2be2',
          'text-primary': '#e9d5ff',
          'text-secondary': '#c4b5fd',
        },
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
