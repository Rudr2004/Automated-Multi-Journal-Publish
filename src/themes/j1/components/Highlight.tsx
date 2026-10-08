/** Wraps every occurrence of the search words in <mark>. Safe: text is never injected as HTML. */
export function Highlight({ text, query }: { text: string; query?: string }) {
  const words = (query ?? '').trim().split(/\s+/).filter((w) => w.length > 1).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.join('|')})`, 'gi')
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? <mark key={i} className="rounded-sm bg-gold-soft px-0.5 text-inherit">{part}</mark> : <span key={i}>{part}</span>)}
    </>
  )
}
