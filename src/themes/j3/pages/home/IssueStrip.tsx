// Current issue strip: cover, folio line, the editors' foreword and links to the table of contents and the previous issue.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { EditorProfile, IssueSummary } from '../../../../core/types'
import { IssueCover } from '../../components/IssueCover'
import { btnPrimary, btnQuiet, labelCls } from './bits'

type Note = { tag: string; title: string; text: string; to: string }

export function IssueStrip({ issue, previous, note, editor }: { issue: IssueSummary; previous?: IssueSummary; note?: Note; editor?: EditorProfile }) {
  return (
    <section aria-labelledby="folio-title" className="mt-12 bg-iris-50 p-5 sm:p-6">
      <div className="grid items-center gap-6 md:grid-cols-12">
        <div className="flex justify-center md:col-span-3">
          <IssueCover volume={issue.volume} issue={issue.issue} className="w-44" />
        </div>
        <div className="flex flex-col gap-4 md:col-span-9">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className={`${labelCls} bg-iris-700 px-2 py-0.5 tracking-wider text-white`}>Current online folio</span>
              <h2 id="folio-title" className="mt-1.5 font-jakarta text-[1.375rem] font-semibold leading-snug text-iris-700">Volume {issue.volume}, Issue {issue.issue} ({formatMonthYear(issue.publishedAt)})</h2>
            </div>
            <p className="font-inter text-[13px] text-mauve-600">
              Articles in this issue: <strong className="text-night-700">{issue.articleCount}</strong> · Licence: <strong className="text-night-700">{journal.licence.name}</strong>
            </p>
          </div>
          {note && (
            <blockquote className="bg-white p-4 ring-1 ring-mauve-100">
              <p className="font-jakarta text-lg font-medium italic leading-relaxed text-night-700">{note.title}. {note.text}</p>
              <footer className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 font-inter text-xs text-mauve-600">
                <span>{editor ? <>— <strong className="text-night-700">{editor.name}</strong>, {editor.role}</> : note.tag}</span>
                <AppLink to={note.to} className="font-medium text-iris-700 underline hover:text-ember-700">Read this issue →</AppLink>
              </footer>
            </blockquote>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <AppLink to={paths.currentIssue} className={btnPrimary}>View table of contents ({issue.articleCount} papers)</AppLink>
            <AppLink to={paths.pastIssues} className={btnQuiet}>Browse all issues</AppLink>
            {previous && <AppLink to={paths.issue(previous.volume, previous.issue)} className={`${labelCls} ml-auto tracking-[0.08em] text-iris-700 underline underline-offset-4 hover:text-ember-700`}>Previous issue (Vol {previous.volume}, No {previous.issue}) →</AppLink>}
          </div>
        </div>
      </div>
    </section>
  )
}
