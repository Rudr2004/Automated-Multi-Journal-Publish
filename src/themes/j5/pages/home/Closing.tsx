// Closing call to action on a deep-wine band. The email-alerts form lives only in the footer.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { ButtonLink } from '../../components/Button'
import { Container, RuledMotif } from '../../components/primitives'
import { Kicker, OrnamentRule } from '../../components/signature'
import { Submit, Track } from '../../icons'

export function FinalCta() {
  return (
    <section aria-labelledby="home-cta" className="relative isolate overflow-hidden bg-bordeaux-900 py-14 text-white sm:py-16">
      <RuledMotif orbits={false} />
      <img src="/journals/j5/images/cta-orbits.svg" alt="" width={420} height={260} className="pointer-events-none absolute -right-6 top-1/2 -z-10 hidden h-auto w-[26rem] -translate-y-1/2 opacity-80 lg:block" />
      <Container>
        <Kicker tone="dark">Publish with {journal.shortName}</Kicker>
        <h2 id="home-cta" className="mt-2 max-w-2xl font-newsreader text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.25rem]">Ready to submit your research?</h2>
        <p className="mt-3 max-w-xl font-serif4 text-[1.0625rem] text-bordeaux-100">No account needed. Upload your manuscript, receive a Paper ID by email, and follow every stage online.</p>
        <OrnamentRule tone="dark" className="mt-5 max-w-md" />
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to={paths.submit} variant="onDarkCta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          <ButtonLink to={paths.track} variant="onDark"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</ButtonLink>
        </div>
      </Container>
    </section>
  )
}
