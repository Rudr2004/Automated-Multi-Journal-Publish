// "Academic Prestige" design tokens for Journal 3 (IJCSD), from docs/references/academic_prestige/DESIGN.md. tailwind.config.js reads this file, so every J3
// colour, radius and shadow is defined once here. The token NAMES (iris, night, ember, mauve) are kept so existing J3 components pick up the new look,
// but the values are now the reference palette:
//   iris  = Archival Navy  (primary #0F2B48: masthead, primary buttons, links)
//   night = Slate ink      (neutral ink and dark surfaces, 900 = deepest navy for header/footer bands)
//   ember = Scholarly Amber (secondary: #B45309 for text/white-text fills, #FD8A42 for fills that carry dark navy text)
//   mauve = Slate          (secondary text and hairlines: 700 #1E293B body ink, 600 #475569 metadata, 100 #E2E8F0 rules)
// Shapes are sharp (0px). J3 keeps its own radius/shadow names (rounded-tile, rounded-block ...) so other journals are never touched.

export const j3Colors = {
  /** Archival Navy: masthead, primary buttons, links, active states. 700 = #0F2B48 (primary), 600 = #1E3A5F (hover). */
  iris: {
    50: '#F2F5F9', 100: '#E1E8F1', 200: '#C5D2E2', 300: '#9DB2CB', 400: '#6E8BAE', 500: '#3E5F86', 600: '#1E3A5F', 700: '#0F2B48', 800: '#0B2038', 900: '#071627', DEFAULT: '#0F2B48',
  },
  /** Slate ink and deep navy surfaces. 900 = #0A1D33 (header/footer bands), 700 = #1E293B (ink). */
  night: {
    50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#1E293B', 800: '#10263F', 900: '#0A1D33', DEFAULT: '#0A1D33',
  },
  /**
   * Scholarly Amber. 700 (#B45309) is for amber text and borders on light surfaces (5.0:1) and for fills with white text.
   * 500 (#FD8A42) is a fill colour: it carries dark navy text (night-900, 7.5:1), never white.
   */
  ember: {
    50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FD9D58', 500: '#FD8A42', 600: '#D9692A', 700: '#B45309', 800: '#8F4207', 900: '#6B3205', DEFAULT: '#FD8A42',
  },
  /** Neutral slate: body text (700), secondary text (600), borders (100-200), parchment surfaces (50). */
  mauve: {
    50: '#F8FAFC', 100: '#E2E8F0', 200: '#CBD5E1', 300: '#94A3B8', 400: '#64748B', 500: '#556377', 600: '#475569', 700: '#1E293B', 800: '#0F172A', 900: '#020617', DEFAULT: '#1E293B',
  },
  /** Peer-validation green (Open Access, accepted, verified marks). Prefixed so it never collides with other themes' token names. */
  j3valid: { 50: '#ECFDF5', 100: '#D1FAE5', 600: '#059669', 700: '#047857', 800: '#065F46', DEFAULT: '#047857' },
  /** Warm editorial paper ground. */
  j3paper: { DEFAULT: '#FCFBF9', cool: '#F8FAFC' },
} as const

export const j3Fonts = {
  /** Source Serif 4: titles, headings and the narrative voice. */
  display: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Georgia', 'serif'],
  /** Source Sans 3: interface text, metadata, DOIs, tables, labels. */
  body: ['"Source Sans 3 Variable"', '"Source Sans 3"', 'system-ui', 'sans-serif'],
}

export const j3Radius = { tile: '0px', block: '0px', sheet: '0px' }

export const j3Shadows = {
  lift3: '0 2px 4px rgba(15, 43, 72, 0.06)',
  dock: '0 4px 16px rgba(15, 43, 72, 0.14)',
}
