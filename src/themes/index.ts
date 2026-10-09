// Loads only the active journal's theme and mock API, so each build ships one journal (the other is code-split away).
import type { ComponentType } from 'react'
import { activeJournalId } from '../config/journals/ids'
import type { JournalApi } from '../core/api'
import type { PrototypeDemo } from '../prototype/demo'

export interface Bootstrapped { Site: ComponentType; api: JournalApi; demo: PrototypeDemo }

export async function loadJournal(): Promise<Bootstrapped> {
  // Compared directly against import.meta.env so a single-journal build drops the other journals.
  const E = import.meta.env.VITE_JOURNAL
  if (E === 'j5' || (E !== 'j1' && E !== 'j2' && E !== 'j3' && E !== 'j4' && activeJournalId === 'j5')) {
    const [{ default: Site }, { j5Api, j5Demo }] = await Promise.all([import('./j5'), import('../mock-data/journals/j5')])
    return { Site, api: j5Api, demo: j5Demo }
  }
  if (E === 'j4' || (E !== 'j1' && E !== 'j2' && E !== 'j3' && E !== 'j5' && activeJournalId === 'j4')) {
    const [{ default: Site }, { j4Api, j4Demo }] = await Promise.all([import('./j4'), import('../mock-data/journals/j4')])
    return { Site, api: j4Api, demo: j4Demo }
  }
  if (E === 'j3' || (E !== 'j1' && E !== 'j2' && E !== 'j4' && activeJournalId === 'j3')) {
    const [{ default: Site }, { j3Api, j3Demo }] = await Promise.all([import('./j3'), import('../mock-data/journals/j3')])
    return { Site, api: j3Api, demo: j3Demo }
  }
  if (E === 'j2' || (E !== 'j1' && E !== 'j3' && E !== 'j4' && activeJournalId === 'j2')) {
    const [{ default: Site }, { j2Api, j2Demo }] = await Promise.all([import('./j2'), import('../mock-data/journals/j2')])
    return { Site, api: j2Api, demo: j2Demo }
  }
  const [{ default: Site }, { j1Api, j1Demo }] = await Promise.all([import('./j1'), import('../mock-data/journals/j1')])
  return { Site, api: j1Api, demo: j1Demo }
}
