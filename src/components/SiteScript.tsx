'use client'

import { useEffect } from 'react'

export type ScriptSize = {
  name: string
  price: number
  dim: string
  cap: string
  form: string
  uses: string[]
  wa: string
}

type Props = {
  sizes: ScriptSize[]
  /** `https://wa.me/<number>?text=` */
  waBase: string
  greeting: string
}

/**
 * All of the page's behaviour, working on the server-rendered markup by id and class:
 * hero reveal and film, header state, scroll reveals, counters, banner parallax,
 * the size selector and the two forms that open WhatsApp.
 */
export function SiteScript({ sizes, waBase, greeting }: Props) {
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ac = new AbortController()
    const { signal } = ac
    const observers: IntersectionObserver[] = []
    const byId = (id: string) => document.getElementById(id)

    /* Hero: reveal + video */
    const hero = byId('hero')
    requestAnimationFrame(() => hero?.classList.add('go'))

    const v = byId('hv') as HTMLVideoElement | null
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saveData = connection?.saveData === true
    if (!RM && !saveData && hero && v?.dataset.src) {
      if (!v.querySelector('source')) {
        const src = document.createElement('source')
        src.src = v.dataset.src
        src.type = v.dataset.type || 'video/mp4'
        v.appendChild(src)
        v.load()
      }
      v.addEventListener('playing', () => v.classList.add('on'), { once: true, signal })
      const hio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) v.play().catch(() => {})
            else v.pause()
          })
        },
        { threshold: 0.15 },
      )
      hio.observe(hero)
      observers.push(hio)
    }

    /* Header state */
    const hdr = byId('hdr')
    const wa = byId('wa')
    const booking = byId('tempah')
    const onScroll = () => {
      const y = window.scrollY
      hdr?.classList.toggle('solid', y > window.innerHeight * 0.72)
      if (wa && booking) {
        const bk = booking.getBoundingClientRect()
        wa.classList.toggle('on', y > 600 && !(bk.top < window.innerHeight && bk.bottom > 0))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true, signal })
    onScroll()

    /* Reveals */
    const rv = document.querySelectorAll('.rv')
    if (RM || !('IntersectionObserver' in window)) {
      rv.forEach((e) => e.classList.add('in'))
    } else {
      const io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px' },
      )
      rv.forEach((e) => io.observe(e))
      observers.push(io)
    }

    /* Counters */
    const counted = new WeakSet<Element>()
    const countUp = (el: HTMLElement) => {
      if (counted.has(el)) return
      counted.add(el)
      const target = parseInt(el.dataset.count ?? '0', 10)
      const dur = 1100
      let t0: null | number = null
      if (RM) {
        el.textContent = String(target)
        return
      }
      const tick = (ts: number) => {
        if (t0 === null) t0 = ts
        const p = Math.min(1, (ts - t0) / dur)
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const nums = document.querySelectorAll<HTMLElement>('[data-count]')
    if ('IntersectionObserver' in window) {
      const nio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              countUp(e.target as HTMLElement)
              nio.unobserve(e.target)
            }
          })
        },
        { threshold: 0.6 },
      )
      nums.forEach((e) => nio.observe(e))
      observers.push(nio)
    } else {
      nums.forEach(countUp)
    }

    /* Parallax on the big moment image */
    const pm = byId('pmx')
    if (pm?.parentElement && !RM && window.matchMedia('(min-width:761px)').matches) {
      const frame = pm.parentElement
      let queued = false
      const par = () => {
        queued = false
        const r = frame.getBoundingClientRect()
        if (r.bottom < 0 || r.top > window.innerHeight) return
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height)
        pm.style.transform = 'translateY(' + -(p - 0.5) * 6 + '%)'
      }
      window.addEventListener(
        'scroll',
        () => {
          if (!queued) {
            queued = true
            requestAnimationFrame(par)
          }
        },
        { passive: true, signal },
      )
      par()
    }

    /* Size selector */
    const sizeTabs = Array.from(document.querySelectorAll<HTMLElement>('.size-tab'))
    const sizeImgs = document.querySelectorAll<HTMLElement>('.size-stage img')
    const setText = (id: string, text: string) => {
      const el = byId(id)
      if (el) el.textContent = text
    }
    const pickSize = (i: number) => {
      const s = sizes[i]
      if (!s) return
      sizeTabs.forEach((t) => t.setAttribute('aria-selected', String(Number(t.dataset.i) === i)))
      sizeImgs.forEach((im) => im.classList.toggle('on', Number(im.dataset.i) === i))
      setText('s-price', String(s.price))
      setText('s-dim', s.dim)
      setText('s-cap', s.cap)
      byId('s-uses')?.replaceChildren(
        ...s.uses.map((use) => {
          const li = document.createElement('li')
          li.textContent = use
          return li
        }),
      )
      const cta = byId('s-cta') as HTMLAnchorElement | null
      if (cta) {
        cta.href = waBase + encodeURIComponent(s.wa)
        cta.textContent = 'Tempah ' + s.name
      }
      byId('size-panel')?.setAttribute('aria-labelledby', 'size-tab-' + i)
      /* keep both enquiry forms on the size the visitor is looking at */
      ;['q-size', 'b-size'].forEach((id) => {
        const el = byId(id) as HTMLSelectElement | null
        if (el) el.value = s.form
      })
    }
    sizeTabs.forEach((t) => {
      const i = Number(t.dataset.i)
      t.addEventListener('click', () => pickSize(i), { signal })
      t.addEventListener(
        'keydown',
        (e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
          e.preventDefault()
          const count = sizeTabs.length
          const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + count) % count
          sizeTabs[n].focus()
          pickSize(n)
        },
        { signal },
      )
    })

    /* Forms -> WhatsApp */
    const q = (id: string) => (byId(id) as HTMLSelectElement | null)?.value ?? ''
    const send = (size: string, area: string, days: string, waste: string) => {
      let m =
        greeting + ' Saya nak sewa *' + size + '* di *' + area + '* untuk *' + days + ' hari*.'
      if (waste) m += ' Jenis sisa: ' + waste + '.'
      m += ' Boleh sahkan harga dan tarikh penghantaran?'
      window.open(waBase + encodeURIComponent(m), '_blank', 'noopener')
    }
    byId('qform')?.addEventListener(
      'submit',
      (e) => {
        e.preventDefault()
        send(q('q-size'), q('q-area'), q('q-days'), '')
      },
      { signal },
    )
    byId('bform')?.addEventListener(
      'submit',
      (e) => {
        e.preventDefault()
        send(q('b-size'), q('b-area'), q('b-days'), q('b-waste'))
      },
      { signal },
    )

    return () => {
      ac.abort()
      observers.forEach((o) => o.disconnect())
    }
  }, [sizes, waBase, greeting])

  return null
}
