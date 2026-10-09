import { PageHead } from '../components/PageHead'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { paths } from '../../../config/routes'

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHead crumbs={[{ label: 'Home', to: paths.home }, { label: title }]} eyebrow="In preparation" title={title}
        subtitle="This page is scheduled for a later build phase." />
      <Container className="mt-8 pb-6">
        <div className="max-w-xl border border-line bg-paper p-6">
          <p className="text-sm leading-relaxed text-ink">The section is not available yet. You can continue from the journal home page.</p>
          <ButtonLink to={paths.home} variant="primary" className="mt-4">Back to Home</ButtonLink>
        </div>
      </Container>
    </>
  )
}
