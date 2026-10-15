// The right column of the home page, loaded from the same home data, so every other page (except the article page) can show it too.
import { useEffect, useState } from 'react'
import { api } from '../../../core/api'
import type { HomeData } from '../../../core/types'
import { SidebarCards } from '../pages/home/Sidebar'

let cache: Promise<HomeData> | null = null
const load = () => (cache ??= api.getHome().catch((e) => { cache = null; throw e }))

export function HomeRail() {
  const [data, setData] = useState<HomeData | null>(null)
  useEffect(() => { let live = true; load().then((d) => live && setData(d)).catch(() => undefined); return () => { live = false } }, [])
  if (!data) return null
  return <SidebarCards cfp={data.callForPapers} editors={data.leadership} />
}
