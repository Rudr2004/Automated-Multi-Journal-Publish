import { j2Colors, j2Fonts, j2Radius, j2Shadows } from './src/themes/j2/tokens.ts'
import { j3Colors, j3Fonts, j3Radius, j3Shadows } from './src/themes/j3/tokens.ts'
import { j4Colors, j4Fonts, j4Radius, j4Shadows } from './src/themes/j4/tokens.ts'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Journal 1 design tokens — from the approved design system (Primary #14284B, Secondary #1F4E9C, Tertiary #E07B00, Neutral #5B6573)
        navy: {
          50: '#EBF0FA', 100: '#D6E0F3', 200: '#AFC1E3', 300: '#7F9ACB', 500: '#1F4E9C',
          600: '#1B4488', 700: '#183868', DEFAULT: '#14284B', 900: '#0B1930',
        },
        // "gold" key = Tertiary orange. Used ONLY for the "Submit Manuscript" call to action.
        gold: { DEFAULT: '#E07B00', dark: '#B86400', soft: '#FFF1E0' },
        // Scholar Blue: actions such as Download PDF, links and focus rings (same value as navy-500).
        scholar: { DEFAULT: '#1F4E9C', dark: '#1B4488', soft: '#E8EFFA' },
        // Warm Paper: abstracts, callouts and index tags.
        paper: { DEFAULT: '#F7F5F0', 200: '#EFEBE1' },
        oa: { DEFAULT: '#2F7D4F', soft: '#E6F3EA' }, // Open Access
        mist: { DEFAULT: '#EDF2FD', 200: '#DEE7F8' }, // tinted light-blue surfaces
        line: '#D9DCE1',
        ink: { DEFAULT: '#1B2433', muted: '#5B6573' },
        danger: '#B42318',
        // Journal 2 (Emerald Scholar): own names so nothing above changes.
        ...j2Colors,
        // Journal 3 (Editorial Magazine)
        ...j3Colors,
        // Journal 4 (Scholarly Precision)
        ...j4Colors,
      },
      fontFamily: {
        serif: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3 Variable"', '"Source Sans 3"', 'system-ui', 'sans-serif'],
        display: j2Fonts.display,
        body: j2Fonts.body,
        jakarta: j3Fonts.display,
        inter: j3Fonts.body,
        serif4: j4Fonts.serif,
        work: j4Fonts.work,
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        // Journal 2 motion: short and subtle; index.css switches all animation off for reduced-motion users.
        'toast-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'toast-in': 'toast-in .2s ease-out', 'fade-in': 'fade-in .15s ease-out', 'slide-down': 'slide-down .18s ease-out',
      },
      maxWidth: { site: '1280px', prose: '75ch' },
      // Flat and formal: 4px radius everywhere (2px for badges). Circles/avatars keep `rounded-full`.
      borderRadius: { ...j2Radius, ...j3Radius, ...j4Radius, none: '0', sm: '2px', DEFAULT: '4px', md: '4px', lg: '4px', xl: '4px', '2xl': '4px', '3xl': '4px', card: '4px', full: '9999px' },
      // 1px borders instead of shadows; `lift` is the very soft hover lift. xl/2xl stay for modals and issue covers.
      boxShadow: {
        sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none',
        xl: '0 12px 32px rgba(20, 40, 75, 0.18)', '2xl': '0 20px 44px rgba(20, 40, 75, 0.28)',
        lift: '0 3px 10px rgba(20, 40, 75, 0.08)', inner: 'none', none: 'none',
        ...j2Shadows,
        ...j3Shadows,
        ...j4Shadows,
      },
    },
  },
  plugins: [],
}
