// "Why scholars publish with IJFRD": the journal config's trust ledger as four cards.
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { AppLink } from '../../../../core/router'
import { ArrowRight, Award, LinkIcon, OpenAccess, Shield, Verified, type IconProps } from '../../icons'
import { HomeSection } from './HomeHead'

const ICONS: Record<string, ComponentType<IconProps>> = { 'shield-check': Shield, unlock: OpenAccess, link: LinkIcon, award: Award }

export function TrustLedger() {
  const items = journal.trustLedger ?? []
  if (!items.length) return null
  return (
    <HomeSection id="trust-title" label="Why publish with us" title={`Why scholars publish with ${journal.shortName}`}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t, i) => {
          const Icon = ICONS[t.icon] ?? Verified
          return (
            <li key={t.id}>
              <AppLink to={t.to} className="group flex h-full flex-col rounded border border-obsidian-200 border-t-[3px] border-t-ochre-600 bg-[#FBF8F4] p-5 transition duration-150 hover:-translate-y-px hover:border-wine-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <span className="flex items-center justify-between">
                  <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded bg-wine-800 text-white"><Icon className="h-6 w-6" /></span>
                  <span aria-hidden="true" className="font-newsreader text-2xl font-semibold tabular-nums text-wine-800/30">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="mt-4 font-newsreader text-xl font-semibold leading-snug text-obsidian-900 group-hover:text-wine-800">{t.title}</span>
                <span className="mt-1.5 font-serif4 text-[15px] leading-relaxed text-obsidian-700">{t.text}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-wine-800">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></span>
              </AppLink>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
