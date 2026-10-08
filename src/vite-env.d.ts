/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Which journal this build serves: "j1" (default) or "j2". */
  readonly VITE_JOURNAL?: 'j1' | 'j2' | 'j3'
  /** Optional links to each journal's site, used by the journal tabs at the top of the page. */
  readonly VITE_URL_J1?: string
  readonly VITE_URL_J2?: string
  readonly VITE_URL_J3?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
