// "Why JIMRT": four commitments, each linking to the matching policy. No unverified statistics: this is a new journal.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { Container, SectionHeading } from '../../components/primitives'
import { Award, LinkIcon, OpenAccess, Speed, type IconProps } from '../../icons'
import type { ComponentType } from 'react'

const items: { icon: ComponentType<IconProps>; title: string; text: string; to: string }[] = [
  { icon: Speed, title: 'Fast, fair review', text: 'Every paper is screened by an editor and reviewed by experts. We aim for a first decision in about two weeks, and you can follow each step with your Paper ID.', to: paths.policy('peer-review') },
  { icon: OpenAccess, title: 'Open access for everyone', text: `Every article is free to read, share and reuse under ${journal.licence.name}. Authors keep their copyright.`, to: paths.policy('open-access') },
  { icon: LinkIcon, title: 'A permanent DOI', text: `Each article receives a DOI under ${journal.doiPrefix}, registered with Crossref, so citations keep working.`, to: paths.policy('archiving') },
  { icon: Award, title: 'Certificates you can verify', text: 'Every author receives a certificate with a QR code that anyone can scan to confirm it is genuine.', to: paths.verify() },
]

export function WhyJimrt() {
  return (
    <section aria-labelledby="why-title" className="py-14 sm:py-20">
      <Container>
        <SectionHeading id="why-title" eyebrow={`Why ${journal.shortName}`} title="Publishing that respects your time and your work" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text, to }) => (
            <li key={title} className="rounded-panel border border-graphite-200 bg-white p-6 shadow-card">
              <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-soft bg-brand-50 text-brand-800"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold text-graphite-800">{title}</h3>
              <p className="mt-2 text-sm text-graphite-700">{text}</p>
              <AppLink to={to} className="mt-4 inline-block text-sm font-semibold text-accent-700 hover:underline">Learn more →</AppLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
