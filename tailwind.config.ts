import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { acid: '#61ff75', night: '#050805' }, fontFamily: { mono: ['var(--font-geist-mono)', 'monospace'] } } }, plugins: [] };
export default config;
