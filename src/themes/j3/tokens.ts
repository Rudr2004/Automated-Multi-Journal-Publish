// "Editorial Magazine" design tokens for Journal 3 (IJCSD). tailwind.config.js reads this file, so every J3 colour,
// radius and shadow is defined once here. Scales run 50 → 900 and are anchored on the brand colours:
//   iris 700 = #4B2E9B (primary), night 900 = #1B1430 (secondary), ember 500 = #F26B3A (tertiary), mauve 700 = #3A3350 (neutral).
// J3 uses its own radius/shadow names (rounded-tile, rounded-block …) so J1's flat 4px/no-shadow tokens are never touched.

export const j3Colors = {
  /** Primary deep violet: key brand surfaces, primary buttons, active states. */
  iris: {
    50: '#F4F3F9', 100: '#DCD7EC', 200: '#C4BADE', 300: '#AC9ED1', 400: '#9482C3', 500: '#7B66B6', 600: '#634AA8', 700: '#4B2E9B', 800: '#34206B', 900: '#1C113B', DEFAULT: '#4B2E9B',
  },
  /** Secondary near-black indigo: header and footer backgrounds, inverted buttons, headings. */
  night: {
    50: '#F2F1F3', 100: '#DAD9DD', 200: '#C2C0C7', 300: '#AAA7B2', 400: '#928F9C', 500: '#7A7687', 600: '#635E71', 700: '#4B455B', 800: '#332D46', 900: '#1B1430', DEFAULT: '#1B1430',
  },
  /**
   * Tertiary warm orange, ONLY for "Submit Manuscript" and key calls to action.
   * White text on #F26B3A is only 3.0:1 (fails WCAG AA), so orange buttons carry dark indigo text (night-900, 5.8:1).
   * A darker orange (700, #A74A28) passes with white text (5.8:1) where white text is needed.
   */
  ember: {
    50: '#FEF6F3', 100: '#FCDACE', 200: '#F9BFA9', 300: '#F7A384', 400: '#F4875F', 500: '#F26B3A', 600: '#CC5A31', 700: '#A74A28', 800: '#81391F', 900: '#5C2916', DEFAULT: '#F26B3A',
  },
  /** Neutral muted plum grey: body text, borders, secondary text. */
  mauve: {
    50: '#F3F3F5', 100: '#D9D8DD', 200: '#BEBCC6', 300: '#A4A1AE', 400: '#898597', 500: '#6F6A7F', 600: '#544E68', 700: '#3A3350', 800: '#282337', 900: '#16131E', DEFAULT: '#3A3350',
  },
} as const

export const j3Fonts = {
  /** Plus Jakarta Sans: headlines and labels (buttons, tags, small caps). */
  display: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
  /** Inter: body text. */
  body: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
}

export const j3Radius = { tile: '16px', block: '20px', sheet: '28px' }

export const j3Shadows = {
  lift3: '0 6px 20px rgba(27, 20, 48, 0.10)',
  dock: '0 10px 30px rgba(27, 20, 48, 0.22)',
}
