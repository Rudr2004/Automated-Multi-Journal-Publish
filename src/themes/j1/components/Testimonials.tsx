import { ChevronLeft, ChevronRight, Quote } from './uiIcons'
import { useEffect, useRef, useState } from 'react'
import type { Testimonial } from '../../../mock-data/journals/j1'
import { Avatar } from './Avatar'

const INTERVAL_MS = 6500

/**
 * Sliding testimonial carousel. Slides move left in one direction (1 → 2 → 3 → 1): a copy of the first slide sits at the
 * end of the track, and after it is reached the track silently jumps back to the real first slide.
 * Autoplay pauses on hover / focus and is off for visitors who prefer reduced motion.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const n = items.length
  const slides = [...items, items[0]] // trailing clone for the seamless loop
  const [idx, setIdx] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const active = idx % n
  const raf = useRef(0)

  const next = () => { if (idx >= n) return; setAnimate(true); setIdx(idx + 1) }
  const prev = () => {
    if (idx === 0) {
      // Jump (without animation) to the clone, then slide back to the last real slide.
      setAnimate(false); setIdx(n)
      raf.current = requestAnimationFrame(() => { raf.current = requestAnimationFrame(() => { setAnimate(true); setIdx(n - 1) }) })
    } else { setAnimate(true); setIdx(idx - 1) }
  }
  const goTo = (k: number) => { setAnimate(true); setIdx(k) }
  const onTransitionEnd = () => { if (idx === n) { setAnimate(false); setIdx(0) } }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce || n < 2) return
    const id = setTimeout(next, INTERVAL_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, n])

  return (
    <section aria-roledescription="carousel" aria-label="Author testimonials" className="mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-navy to-navy-700 text-white shadow-lg">
        <Quote aria-hidden className="pointer-events-none absolute -left-4 -top-4 h-36 w-36 text-white/5" strokeWidth={1} />
        <div className={`flex ${animate ? 'transition-transform duration-700 ease-in-out motion-reduce:transition-none' : ''}`}
          style={{ transform: `translateX(-${idx * 100}%)` }} onTransitionEnd={onTransitionEnd} aria-live={paused ? 'polite' : 'off'}>
          {slides.map((t, k) => (
            <figure key={k} role="group" aria-roledescription="slide" aria-label={`${(k % n) + 1} of ${n}`} aria-hidden={k % n !== active}
              className="flex w-full shrink-0 flex-col items-center px-6 py-10 text-center sm:px-16 sm:py-12">
              <Quote aria-hidden className="h-8 w-8 text-navy-300" />
              <blockquote className="mt-4 max-w-2xl font-serif text-xl leading-relaxed sm:text-2xl">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex flex-col items-center gap-3">
                <Avatar name={t.name} photo={t.photo} size="lg" />
                <div>
                  <p className="text-lg font-semibold">{t.name}</p>
                  <p className="text-sm text-navy-100">{t.role}</p>
                  <p className="text-sm text-navy-200">{t.institution}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous testimonial" onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy shadow-sm hover:border-navy"><ChevronLeft className="h-4 w-4" aria-hidden /></button>
        <div className="flex items-center gap-2" role="group" aria-label="Choose a testimonial">
          {items.map((t, k) => (
            <button key={t.name} type="button" aria-label={`Show testimonial ${k + 1}: ${t.name}`} aria-current={k === active ? 'true' : undefined} onClick={() => goTo(k)}
              className={`h-2.5 rounded-sm transition-all ${k === active ? 'w-8 bg-navy' : 'w-2.5 bg-navy-200 hover:bg-navy-300'}`} />
          ))}
        </div>
        <button type="button" aria-label="Next testimonial" onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy shadow-sm hover:border-navy"><ChevronRight className="h-4 w-4" aria-hidden /></button>
      </div>
    </section>
  )
}
