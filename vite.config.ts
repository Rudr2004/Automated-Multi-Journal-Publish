import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * What the HTML shell says before the app starts (page title, icon, browser colour, description). Search engines and link previews read this,
 * so each single-journal build (VITE_JOURNAL=j1|j2|j3) writes its own journal's values. Keep these in sync with `branding` in src/config/journals/*.ts.
 * A combined build (VITE_JOURNAL unset, used by `npm run dev`) keeps the Journal 1 defaults, and the app swaps in the right values when it starts.
 */
const SHELL: Record<string, { title: string; icon: string; themeColor: string; description: string }> = {
  j1: { title: 'IJMAT | International Journal of Multidisciplinary Academic Research and Trends', icon: '/journals/j1/favicon-48.png', themeColor: '#14284B', description: 'IJMAT is a peer-reviewed, open access journal publishing multidisciplinary academic research.' },
  j2: { title: 'JIMRT | Journal of Innovation in Multidisciplinary Research and Technology', icon: '/journals/j2/favicon-48.png', themeColor: '#065F46', description: 'JIMRT is a monthly open access journal for rigorous research and technology papers from every discipline.' },
  j4: { title: 'IJECM | International Journal of Engineering Concepts and Management', icon: '/journals/j4/favicon-48.png', themeColor: '#0F172A', description: 'IJECM is a monthly open access journal for engineering research and engineering management.' },
  j3: { title: 'IJCSD | International Journal of Creative Studies and Development', icon: '/journals/j3/favicon-48.png', themeColor: '#1B1430', description: 'IJCSD is a monthly open access journal for research on design, the arts, media, culture and development.' },
}

const journalShell = (journal: string): Plugin => ({
  name: 'journal-html-shell',
  transformIndexHtml(html) {
    const s = SHELL[journal]
    if (!s) return html
    return html
      .replace(/<title>.*?<\/title>/, `<title>${s.title}</title>`)
      .replace(/(<link rel="icon"[^>]*href=")[^"]*(")/, `$1${s.icon}$2`)
      .replace(/(<meta name="theme-color" content=")[^"]*(")/, `$1${s.themeColor}$2`)
      .replace('</head>', `    <meta name="description" content="${s.description}" />\n    <meta property="og:title" content="${s.title}" />\n    <meta property="og:description" content="${s.description}" />\n    <meta property="og:type" content="website" />\n  </head>`)
  },
})

export default defineConfig(({ mode }) => {
  // loadEnv also picks up variables set by the build command (cross-env VITE_JOURNAL=j2), not only .env files.
  const env = loadEnv(mode, '.', 'VITE_')
  return { plugins: [react(), journalShell(env.VITE_JOURNAL ?? '')] }
})
