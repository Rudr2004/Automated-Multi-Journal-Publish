// "Academic Prestige" (burgundy) design tokens for Journal 5 (IJFRD), from the client's palette: Primary #701A1E, Secondary #B45309,
// Tertiary #4C0519, Neutral #111827. Headline Newsreader, body Source Serif 4, labels Work Sans. tailwind.config.js reads this file.
// Token names are J5-only (wine, ochre, bordeaux, obsidian) so no other journal is affected.
//
// Contrast (WCAG AA needs 4.5:1 for normal text): white on wine-800 11.9 · white on bordeaux-900 17.6 · ochre-700 (#B45309) on white 5.0,
// so ochre-700 may be used for text and for fills carrying white text; ochre-400/500 are fills that carry dark text only.

export const j5Colors = {
  /** Primary burgundy: masthead, primary buttons, links, active states. 800 = #701A1E (primary), 900 = hover/pressed. */
  wine: {
    50: '#FDF2F2', 100: '#FBE4E4', 200: '#F6C6C8', 300: '#EE9EA2', 400: '#DF6E75', 500: '#C4474F', 600: '#A22D35', 700: '#8A2128', 800: '#701A1E', 900: '#55121A', DEFAULT: '#701A1E',
  },
  /** Secondary amber: highlights, impact and editorial marks, link hover, small accents. 700 = #B45309. */
  ochre: {
    50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F', DEFAULT: '#B45309',
  },
  /** Tertiary deep wine: dark bands (header, hero, footer), inverted buttons. 900 = #4C0519. */
  bordeaux: {
    50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#9F1239', 800: '#881337', 900: '#4C0519', DEFAULT: '#4C0519',
  },
  /** Neutral ink and slate surfaces. 900 = #111827 (ink), 600 = #4B5563 (metadata), 200 = hairlines. */
  obsidian: {
    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827', DEFAULT: '#111827',
  },
} as const

export const j5Fonts = {
  /** Newsreader: headlines. */
  newsreader: ['"Newsreader Variable"', '"Newsreader"', 'Georgia', 'serif'],
} as const
