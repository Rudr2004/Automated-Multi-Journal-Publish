// "Emerald Scholar" design tokens for Journal 2 (JIMRT). tailwind.config.js reads this file, so every J2 colour,
// radius and shadow is defined once here. Scales run 50 → 900 and are anchored on the brand colours:
//   brand 800 = #065F46 (primary), accent 700 = #0F766E (secondary), cta 600 = #D97706 (tertiary), graphite 800 = #1F2937 (neutral).
// J2 uses its own radius/shadow names (rounded-soft, shadow-card …) so J1's flat 4px/no-shadow tokens are never touched.

export const j2Colors = {
  /** Primary emerald: header, hero, primary buttons. */
  brand: {
    50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
    500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B', DEFAULT: '#065F46',
  },
  /** Secondary teal: links, secondary buttons, tags, focus rings, active states. */
  accent: {
    50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4', 400: '#2DD4BF',
    500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A', DEFAULT: '#0F766E',
  },
  /**
   * Tertiary amber, ONLY for "Submit Manuscript" and other key calls to action.
   * #D97706 (600) with white text is 3.2:1, which fails WCAG AA for normal text, so buttons use 700 (#B45309, 5.0:1).
   */
  cta: {
    50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
    500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F', DEFAULT: '#B45309',
  },
  /** Neutral graphite: body text and borders. */
  graphite: {
    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
    500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827', DEFAULT: '#1F2937',
  },
} as const

export const j2Fonts = {
  /** DM Sans: headings, the journal name and article titles. */
  display: ['"DM Sans Variable"', '"DM Sans"', 'system-ui', 'sans-serif'],
  /** IBM Plex Sans: body text and interface. */
  body: ['"IBM Plex Sans Variable"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
}

export const j2Radius = { chip: '8px', soft: '10px', panel: '12px', sheet: '16px' }

export const j2Shadows = {
  card: '0 1px 2px rgba(6, 95, 70, 0.06), 0 1px 3px rgba(31, 41, 55, 0.06)',
  soft: '0 4px 14px rgba(6, 95, 70, 0.08)',
  pop: '0 12px 32px rgba(17, 24, 39, 0.16)',
  drawer: '-12px 0 32px rgba(17, 24, 39, 0.14)',
}
