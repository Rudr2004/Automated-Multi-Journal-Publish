// "Academic Editorial & Press" design tokens for Journal 3 (IJCSD), from docs/references/academic_editorial_press/DESIGN.md. tailwind.config.js reads this
// file, so every J3 colour, radius and shadow is defined once here. Scales run 50 -> 900 and are anchored on the brand colours:
//   iris 700 = #4B2E9B (Primary Purple), night 900 = #1B1430 (Plum Ink), ember 500 = #F26B3A (Tertiary Orange, restricted accent), mauve 700 = #3A3350 (Slate Plum).
// Surfaces: white canvas, Mist #F6F4FA (j3paper.cool), Mist Deep #ECE8F5 (j3paper.deep), hairline rule #DAD5E6, Meta Plum #6A6482 (mauve 500/600).
// Shapes: 2px radius everywhere (no pills), no shadows except the floating dock. Fonts: Plus Jakarta Sans for headlines and labels, Inter for body and metadata.
// J3 keeps its own radius/shadow names (rounded-tile, rounded-block ...) so other journals are never touched.

export const j3Colors = {
  /** Primary Purple: navigation states, primary buttons, links, rules. 700 = #4B2E9B, 800 = hover #3B237D family. */
  iris: {
    50: '#F4F3F9', 100: '#DCD7EC', 200: '#C4BADE', 300: '#AC9ED1', 400: '#9482C3', 500: '#7B66B6', 600: '#634AA8', 700: '#4B2E9B', 800: '#3B237D', 900: '#1C113B', DEFAULT: '#4B2E9B',
  },
  /** Plum Ink: headlines, titles, body ink; 900 = #1B1430 also the dark header/footer band. */
  night: {
    50: '#F2F1F3', 100: '#DAD9DD', 200: '#C2C0C7', 300: '#AAA7B2', 400: '#928F9C', 500: '#7A7687', 600: '#635E71', 700: '#4B455B', 800: '#332D46', 900: '#1B1430', DEFAULT: '#1B1430',
  },
  /**
   * Tertiary Orange, a restricted accent (under 5% of any surface): 8px square section markers, open-access padlocks, urgent ribbons, status tags.
   * White text on #F26B3A is only 3.0:1, so orange FILLS carry dark plum text (night-900, 5.8:1); orange TEXT on white uses 700 (#A74A28, 5.8:1).
   */
  ember: {
    50: '#FEF6F3', 100: '#FCDACE', 200: '#F9BFA9', 300: '#F7A384', 400: '#F4875F', 500: '#F26B3A', 600: '#CC5A31', 700: '#A74A28', 800: '#81391F', 900: '#5C2916', DEFAULT: '#F26B3A',
  },
  /** Slate Plum and Meta Plum: abstracts, secondary text (700), metadata (500-600), hairlines (100-200). */
  mauve: {
    50: '#F3F3F5', 100: '#D9D8DD', 200: '#BEBCC6', 300: '#A4A1AE', 400: '#898597', 500: '#6F6A7F', 600: '#544E68', 700: '#3A3350', 800: '#282337', 900: '#16131E', DEFAULT: '#3A3350',
  },
  /** Validation green (verified, accepted marks). Prefixed so it never collides with other themes' token names. */
  j3valid: { 50: '#ECFDF5', 100: '#D1FAE5', 600: '#059669', 700: '#047857', 800: '#065F46', DEFAULT: '#047857' },
  /** Surfaces: white canvas, Mist (side rails, table headers) and Mist Deep (callouts, input fills), plus the hairline rule colour. */
  j3paper: { DEFAULT: '#FFFFFF', cool: '#F6F4FA', deep: '#ECE8F5', rule: '#DAD5E6' },
} as const

export const j3Fonts = {
  /** Plus Jakarta Sans: headlines, titles, labels (buttons, tags, small caps). */
  display: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
  /** Inter: body text, research prose, metadata and tables. */
  body: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
}

export const j3Radius = { tile: '2px', block: '2px', sheet: '2px' }

export const j3Shadows = {
  lift3: '0 1px 2px rgba(27, 20, 48, 0.06)',
  dock: '0 6px 20px rgba(27, 20, 48, 0.16)',
}
