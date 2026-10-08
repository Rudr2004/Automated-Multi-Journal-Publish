import { Breadcrumbs } from '../components/Breadcrumbs'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { paths } from '../../../config/routes'

export function ComingSoon({ title }: { title: string }) {
  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: 'Home', to: paths.home }, { label: title }]} />
      <div className="rounded-card border border-dashed border-line bg-mist p-14 text-center">
        <h1 className="font-serif text-3xl font-semibold text-navy">{title}</h1>
        <p className="mt-2 text-ink-muted">This page is scheduled for a later build phase.</p>
        <ButtonLink to={paths.home} variant="primary" className="mt-6">Back to Home</ButtonLink>
      </div>
    </Container>
  )
}
