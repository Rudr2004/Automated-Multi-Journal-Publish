import { combinedBuild } from './ids'

// The publisher's journals, shown as tabs at the top of every site. Only journals with `built: true` link anywhere.
// Combined build (plain `npm run dev`): the tabs are same-site links, e.g. /jimrt, and switching reloads the page into the other journal.
// Single-journal builds: each journal lives on its own domain; in development the tabs point at the dev servers
// (dev:j1 on 5173, dev:j2 on 5174, dev:j3 on 5175, dev:j4 on 5176). Override any link with VITE_URL_J1 / J2 / J3.
export interface NetworkJournal { code: string; domain?: string; urlKey?: 'VITE_URL_J1' | 'VITE_URL_J2' | 'VITE_URL_J3' | 'VITE_URL_J4'; built: boolean }

export const network: NetworkJournal[] = [
  { code: 'IJMAT', domain: 'ijmat.org', urlKey: 'VITE_URL_J1', built: true },
  { code: 'JIMRT', domain: 'jimrt.org', urlKey: 'VITE_URL_J2', built: true },
  { code: 'IJCSD', domain: 'ijcsd.org', urlKey: 'VITE_URL_J3', built: true },
  { code: 'IJECM', domain: 'ijecm.org', urlKey: 'VITE_URL_J4', built: true },
  { code: 'IJFRD', built: false },
]

const DEV_URL = { VITE_URL_J1: 'http://localhost:5173/ijmat', VITE_URL_J2: 'http://localhost:5174/jimrt', VITE_URL_J3: 'http://localhost:5175/ijcsd', VITE_URL_J4: 'http://localhost:5176/ijecm' }

export const networkHref = (j: NetworkJournal): string | undefined =>
  j.built && combinedBuild ? `/${j.code.toLowerCase()}` : j.built ? (j.urlKey && (import.meta.env[j.urlKey] || (import.meta.env.DEV ? DEV_URL[j.urlKey] : ''))) || `https://${j.domain}` : undefined
