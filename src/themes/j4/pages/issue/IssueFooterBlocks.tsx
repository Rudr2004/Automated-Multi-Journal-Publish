// Blocks below the issue columns (reference: current issue, cover showcase): the dual call-out bar (TOC alerts + "Ready to publish your research?")
// and the Honors / awards showcase. J4 has no awards on record yet, so both award cards show neutral "to be announced" content, never an invented laureate.
import { useState, type FormEvent } from 'react'
import {
  MdOutlineEmojiEvents as Trophy, MdOutlineLibraryBooks as Library, MdOutlineMilitaryTech as Medal, MdOutlineNotificationsActive as Bell, MdOutlineSchool as School,
  MdOutlineUploadFile as Upload, MdOutlineWorkspacePremium as Premium, MdOutlineMarkEmailUnread as Mail, MdOutlinePublish as Publish, MdOutlineVerified as Ver,
} from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { api } from '../../../../core/api'
import * as validate from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { useToast } from '../../components/Toast'
import { ArrowRight } from '../../icons'

export function IssuePreFooter() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const msg = validate.email(email)
    setError(msg)
    if (msg) return
    setBusy(true)
    try { await api.subscribe(email.trim()); toast('Subscribed. Issue alerts will arrive by email.'); setEmail('') } catch { setError('Could not subscribe. Please try again.') } finally { setBusy(false) }
  }
  return (
    <section aria-label="Alerts and submission" className="mt-10 rounded-[12px] border border-slate-800 bg-gradient-to-r from-[#0b2545] via-[#0f3460] to-[#071527] p-6 text-white shadow-hair md:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-6 lg:border-r lg:border-slate-700/80 lg:pr-8">
          <div className="flex items-center gap-2 text-sky-400"><Mail className="h-5 w-5" aria-hidden="true" /><h2 className="font-serif4 text-base font-bold text-white md:text-lg">Subscribe to TOC Alerts</h2></div>
          <p className="text-xs leading-relaxed text-slate-300">Receive the table of contents and call-for-papers notices straight to your inbox when each {journal.frequency.toLowerCase()} issue is published.</p>
          <form onSubmit={submit} noValidate aria-label="Email alerts" className="pt-1">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="j4-issue-toc" className="sr-only">Institutional email</label>
              <input id="j4-issue-toc" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Enter institutional email..." aria-invalid={!!error} aria-describedby={error ? 'j4-issue-toc-err' : undefined}
                className="min-h-11 flex-1 rounded border border-slate-600 bg-slate-800/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 lg:min-h-9" />
              <button type="submit" disabled={busy} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded bg-cobalt-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 lg:min-h-9">
                <Bell className="h-4 w-4" aria-hidden="true" />{busy ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </div>
            {error && <p id="j4-issue-toc-err" role="alert" className="mt-2 text-xs font-medium text-red-300">{error}</p>}
          </form>
          <p className="text-[10px] text-slate-300">No spam. You may unsubscribe at any time.</p>
        </div>
        <div className="space-y-3 lg:col-span-6 lg:pl-4">
          <h2 className="flex items-center gap-2 font-serif4 text-base font-bold text-white md:text-lg"><Publish className="h-5 w-5 text-sky-400" aria-hidden="true" />Ready to Publish Your Research?</h2>
          <p className="text-xs leading-relaxed text-slate-300">Submit your manuscript to {journal.shortName}. Accepted articles are published open access with a permanent Crossref DOI.</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <AppLink to={paths.submit} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-cobalt-700 px-5 py-2.5 text-xs font-semibold text-white shadow-hair transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:min-h-9"><Upload className="h-4 w-4" aria-hidden="true" />Submit Paper Online</AppLink>
            <AppLink to={paths.pastIssues} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:min-h-9"><Library className="h-4 w-4" aria-hidden="true" />Browse Archive Catalog</AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export function IssueHonors() {
  return (
    <section aria-labelledby="issue-honors" className="mt-8 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Premium className="h-7 w-7 text-cobalt-700" aria-hidden="true" />
          <div>
            <h2 id="issue-honors" className="font-serif4 text-lg font-bold text-[#0b2545] md:text-xl">Honors, Research Awards &amp; Mentorship Recognition</h2>
            <p className="text-xs text-slate-500">Recognition of scholarly excellence and research supervision within {journal.shortName}.</p>
          </div>
        </div>
        <span className="hidden items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold text-amber-900 sm:inline-flex">To be announced</span>
      </div>
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        <div className="relative flex flex-col justify-between rounded-[12px] border border-amber-200 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-5 shadow-hair md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white shadow-hair"><Medal className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-serif4 text-sm font-bold uppercase tracking-wider text-amber-950">Best Paper Award</h3>
                  <span className="text-xs font-medium text-amber-800">Editorial Board Recognition</span>
                </div>
              </div>
              <span className="flex items-center gap-1 rounded border border-amber-300 bg-amber-200/80 px-2.5 py-1 text-xs font-bold text-amber-950"><Trophy className="h-4 w-4 text-amber-800" aria-hidden="true" />Not yet awarded</span>
            </div>
            <div className="relative mb-4 overflow-hidden rounded-lg border border-amber-200/70 shadow-hair">
              <img src="/journals/j4/images/hero-truss.svg" alt="" className="h-44 w-full object-cover object-center" />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">Featured research</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-serif4 text-base font-bold leading-snug text-[#0b2545]">Winner to be announced</h4>
              <p className="text-xs italic text-slate-600">{journal.name}</p>
              <p className="pt-1 text-xs leading-relaxed text-slate-600">The editorial board will name an outstanding {journal.shortName} paper here once the first full volume has been published and reviewed.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-amber-200/60 pt-4 text-xs">
            <span className="rounded border border-amber-200 bg-amber-100 px-2.5 py-1 font-semibold text-amber-900">Open access, CC BY 4.0</span>
            <AppLink to={paths.currentIssue} className="flex items-center gap-1 font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">Read Current Issue<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-[12px] border border-sky-200 bg-white p-5 shadow-hair md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt-700 text-white shadow-hair"><School className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-serif4 text-sm font-bold uppercase tracking-wider text-cobalt-700">Distinguished Mentor Award</h3>
                  <span className="text-xs text-slate-500">Excellence in Research Supervision</span>
                </div>
              </div>
              <span className="rounded border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900">Academic Faculty</span>
            </div>
            <div className="mb-4 flex flex-col items-center gap-4 rounded-lg border border-sky-100 bg-sky-50/50 p-4 sm:flex-row sm:items-start">
              <span aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-sky-300 bg-white shadow-hair"><img src="/journals/j4/logo.png" alt="" className="h-full w-full rounded-xl object-contain p-2" /></span>
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-serif4 text-base font-bold leading-tight text-[#0b2545]">Honouree to be announced</p>
                <p className="text-xs font-medium text-slate-700">Research guide or supervisor</p>
                <p className="text-xs italic text-slate-500">{journal.name}</p>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-slate-600">The editorial board will recognise a supervisor whose students publish strong work in {journal.shortName}. Nominations will be announced on this page.</p>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
            <span className="flex items-center gap-1 text-slate-500"><Ver className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />Announced by the editorial board</span>
            <AppLink to={paths.about('contact')} className="flex items-center gap-1 font-bold text-cobalt-700 hover:text-cobalt-800 hover:underline">Nominate a Research Guide<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
          </div>
        </div>
      </div>
    </section>
  )
}
