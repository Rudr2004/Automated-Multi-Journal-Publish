import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { journal } from './config/journals'
import { installApi } from './core/api'
import { loadJournal } from './themes'
import './index.css'

// Branding comes from the active journal's config: tab title, favicon, browser colour and the CSS theme hook.
document.title = journal.branding.pageTitle
document.documentElement.dataset.journal = journal.id
const setLink = (rel: string, href: string) => {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el) }
  el.href = href
  const path = href.split('?')[0]
  el.type = path.endsWith('.svg') ? 'image/svg+xml' : path.endsWith('.png') ? 'image/png' : ''
}
setLink('icon', journal.branding.favicon)
if (journal.branding.touchIcon) setLink('apple-touch-icon', journal.branding.touchIcon)
document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', journal.branding.themeColor)

// Load only this build's theme and data, then start the app.
void loadJournal().then(({ Site, api, demo }) => {
  installApi(api)
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App Site={Site} demo={demo} />
    </React.StrictMode>,
  )
})
