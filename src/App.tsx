import type { ComponentType } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BASE } from './config/routes'
import PrototypeIndex from './prototype/PrototypeIndex'
import type { PrototypeDemo } from './prototype/demo'

/** Old /j1/... links keep working: they redirect to the same page under the journal's own address. */
function LegacyRedirect() {
  const { pathname, search, hash } = useLocation()
  return <Navigate to={`${BASE}${pathname.replace(/^\/j1/, '')}${search}${hash}`} replace />
}

export default function App({ Site, demo }: { Site: ComponentType; demo: PrototypeDemo }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${BASE}/*`} element={<Site />} />
        <Route path="/j1/*" element={<LegacyRedirect />} />
        <Route path="/prototype-index" element={<PrototypeIndex demo={demo} />} />
        <Route path="*" element={<Navigate to={BASE} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
