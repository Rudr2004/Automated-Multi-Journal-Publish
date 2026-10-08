import { ButtonLink } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { paths } from '../../../config/routes'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: 'Not found' }]} title={`We couldn’t find that ${what}`} subtitle="The link may be outdated or mistyped. Try one of these instead." />
      <Container className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to={paths.home} variant="primary">Back to Home</ButtonLink>
        <ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink>
        <ButtonLink to={paths.pastIssues} variant="outline">Past Issues</ButtonLink>
      </Container>
    </>
  )
}
