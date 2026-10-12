// Four key-feature cards under the hero: peer review, open access, publication ethics and the editorial board. Each links to its page; wording comes from the journal config.
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { FactCheck, LockOpen, Policy, VerifiedUser } from '../../components/refIconsJ4'
import type { IconProps } from '../../icons'

export function Features() {
  const items: { title: string; link: string; to: string; icon: ComponentType<IconProps> }[] = [
    { title: 'Peer Review Process', link: 'Structured Review Standard', to: paths.policy('peer-review'), icon: FactCheck },
    { title: 'Open Access Policy', link: `${journal.licence.name} License`, to: paths.policy('open-access'), icon: LockOpen },
    { title: 'Publication Ethics', link: 'Ethics Statement', to: paths.policy('publication-ethics'), icon: VerifiedUser },
    { title: 'Editorial Transparency', link: 'Editorial Board Members', to: paths.editorialBoard, icon: Policy },
  ]
  return (
    <ul aria-label="Journal standards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, link, to, icon: Icon }) => (
        <li key={title} className="flex">
          <AppLink to={to} className="group flex w-full items-center gap-3.5 rounded-[8px] border border-[#d2e7fc] bg-white p-4 transition-shadow hover:shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e0effe] text-cobalt-700"><Icon className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#0b2545]">{title}</span>
              <span className="mt-0.5 flex items-center gap-0.5 text-xs font-medium text-cobalt-700 group-hover:underline">{link} <span className="text-[10px]" aria-hidden="true">→</span></span>
            </span>
          </AppLink>
        </li>
      ))}
    </ul>
  )
}
