// "Scholarly Precision" design tokens for Journal 4 (IJECM). tailwind.config.js reads this file, so every J4 colour, radius and shadow is defined once here.
// The brand colours sit on the Tailwind slate and sky scales (50 → 900), under J4's own names so no other journal is affected:
//   abyss 900 = #0F172A (primary), azure 600 = #0284C7 (secondary), cobalt 700 = #0369A1 (tertiary), steel 600 = #475569 (neutral).
//
// Contrast (WCAG AA needs 4.5:1 for normal text, 3:1 for large text and interface parts):
//   white on abyss-900 17.9 · steel-600 on white 7.6 · cobalt-700 on white 5.9 (links and Submit buttons, white text on it is 5.9)
//   azure-600 on white is only 4.1, so azure is for focus rings, borders, icons and large accents, never for small text or white-text buttons.
//   On the dark hero, small accent text uses sky-300 (10.7) or sky-400 (8.3); azure-600 on abyss-900 is only 4.4.

export const j4Colors = {
  /** Primary deep slate navy: hero, footer, scrolled header, headings. */
  abyss: {
    50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8',
    500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A', DEFAULT: '#0F172A',
  },
  /** Secondary sky blue: focus rings, active states, data accents. */
  azure: {
    50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8',
    500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E', DEFAULT: '#0284C7',
  },
  /** Tertiary deep sky blue: "Submit Manuscript", key calls to action, links, hover state of azure. */
  cobalt: {
    50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8',
    500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E', DEFAULT: '#0369A1',
  },
  /** Neutral slate grey: body text, borders, muted text. */
  steel: {
    50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8',
    500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A', DEFAULT: '#475569',
  },
} as const

export const j4Fonts = {
  /** Source Serif 4: journal name, page titles, article titles. */
  serif: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Georgia', 'serif'],
  /** Work Sans: body text, interface, buttons, tags and table headers. */
  work: ['"Work Sans Variable"', '"Work Sans"', 'system-ui', 'sans-serif'],
}

/** Crisp 6–8px corners, set under J4's own names. */
export const j4Radius = { ctl: '6px', pane: '8px' }

/** Very light shadows; borders do most of the work. */
export const j4Shadows = {
  hair: '0 1px 2px rgba(15, 23, 42, 0.06)',
  panel: '0 4px 14px rgba(15, 23, 42, 0.08)',
  float: '0 12px 32px rgba(15, 23, 42, 0.18)',
}
