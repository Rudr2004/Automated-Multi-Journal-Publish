import { Breadcrumbs } from './Breadcrumbs'
import { Container } from './primitives'

/** Thin warm-paper breadcrumb strip that sits directly under the navigation (policy and portal pages). */
export function CrumbBar({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <div className="border-b border-line bg-paper">
      <Container><div className="-my-1"><Breadcrumbs items={items} /></div></Container>
    </div>
  )
}
