import { useSearchParams } from 'react-router-dom'
import { journal } from '../../config/journals'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'

export function SubmitContainer() {
  const [params] = useSearchParams()
  const { Submit } = useTheme().pages
  return (
    <Submit
      // ?state=success shows the confirmation screen directly (prototype index).
      initialPaperId={params.get('state') === 'success' ? `${journal.paperIdPrefix}2026000123` : null}
      onSubmit={(f) => api.submitManuscript({ title: f.title, email: f.author.email, authorName: f.author.name })}
    />
  )
}

export function TrackContainer() {
  const [params] = useSearchParams()
  const { Track } = useTheme().pages
  const initial = { paperId: params.get('id') ?? undefined, email: params.get('email') ?? undefined }
  return <Track key={`${initial.paperId}|${initial.email}`} initial={initial} onTrack={api.trackPaper} onSendOtp={api.sendOtp} onVerifyOtp={api.verifyOtp} onPay={api.payApc} onPaymentProof={api.submitPaymentProof} />
}

export function VerifyContainer() {
  const [params] = useSearchParams()
  const { pages: { Verify }, AsyncView } = useTheme()
  const id = params.get('id') ?? ''
  // When arriving via QR code (?id=…), verify immediately and show the result.
  const state = useAsync(() => (id ? api.verifyCertificate(id) : Promise.resolve(null)), [id])
  if (!id) return <Verify onVerify={api.verifyCertificate} />
  return <AsyncView state={state}>{(result) => <Verify initialId={id} initialResult={result} onVerify={api.verifyCertificate} />}</AsyncView>
}

export function SearchContainer() {
  const [params] = useSearchParams()
  const { pages: { Search }, AsyncView } = useTheme()
  const q = params.get('q') ?? ''
  const state = useAsync(() => api.searchArticles(q), [q])
  return <AsyncView state={state}>{(results) => <Search key={q} query={q} results={results} />}</AsyncView>
}
