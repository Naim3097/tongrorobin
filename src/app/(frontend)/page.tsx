import type { Metadata } from 'next'
import { getImageProps } from 'next/image'
import React from 'react'

import { CmsImage } from '@/components/CmsImage'
import { BinSilhouette, TickIcon, WhatsAppIcon } from '@/components/icons'
import { InlineText, Lines } from '@/components/InlineText'
import { SiteScript } from '@/components/SiteScript'
import { stripInline } from '@/lib/inlineLinks'
import { asMedia, defaultSizeIndex, getSiteData, toBinSize, waBase, waLink } from '@/lib/site'
import type { Media } from '@/payload-types'

const DEFAULT_RENTAL_DAYS = 3
const OTHER_AREA = 'Kawasan lain'

/** Scroll-reveal classes for the nth item of a group: each one a beat later, up to three. */
const rv = (i = 0): string => (i === 0 ? 'rv' : `rv rv-d${Math.min(i, 3)}`)

/** A CMS image as a CSS `url()`, resized and re-encoded like the `<img>` ones. */
const backgroundUrl = (media: Media | null | number | undefined): string | undefined => {
  const file = asMedia(media)
  if (!file?.url || !file.width || !file.height) return undefined

  const { props } = getImageProps({
    src: file.url,
    width: file.width,
    height: file.height,
    alt: '',
    sizes: '100vw',
  })
  return `url("${props.src}")`
}

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData()
  if (!settings.siteUrl) return {}

  const ogImage = asMedia(settings.ogImage)?.url
  const logo = asMedia(settings.logo)?.url

  return {
    metadataBase: new URL(settings.siteUrl),
    title: settings.metaTitle,
    description: settings.metaDescription,
    alternates: { canonical: '/' },
    icons: logo ? { icon: logo } : undefined,
    openGraph: {
      type: 'website',
      siteName: settings.businessName,
      title: settings.metaTitle,
      description: settings.ogDescription || settings.metaDescription,
      url: '/',
      images: ogImage ? [ogImage] : undefined,
      locale: 'ms_MY',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function HomePage() {
  const { home, settings } = await getSiteData()

  // Nothing to show until the globals have been saved once (`pnpm seed`).
  if (!settings.whatsappNumber || !home.sizes?.items?.length) return null

  const { hero, work, moment, process, why, coverage, faq, booking } = home
  const number = settings.whatsappNumber
  const defaultWa = waLink(number, settings.defaultWhatsappMessage)
  const tel = `tel:+${number}`

  const sizes = home.sizes.items.map((item) => toBinSize(item, settings.whatsappGreeting))
  const selected = defaultSizeIndex(home.sizes.items)
  const current = sizes[selected]
  const prices = sizes.map((size) => size.price)

  const areas = (coverage.areas ?? []).map((area) => area.name)
  const allAreas = [coverage.baseName, ...areas]
  const areaRows = [
    areas.slice(0, Math.ceil(areas.length / 2)),
    areas.slice(Math.ceil(areas.length / 2)),
  ]

  const maxDays = home.sizes.maxRentalDays
  const days = Array.from({ length: maxDays }, (_, i) => i + 1)
  const defaultDays = Math.min(DEFAULT_RENTAL_DAYS, maxDays)

  const logo = asMedia(settings.logo)
  const poster = asMedia(hero.poster)
  const video = asMedia(hero.video)
  const faqItems = faq.items ?? []

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${settings.siteUrl}/#business`,
    name: settings.businessName,
    url: `${settings.siteUrl}/`,
    image: asMedia(settings.ogImage)?.url,
    logo: logo?.url,
    description: settings.schemaDescription || settings.metaDescription,
    telephone: `+${number}`,
    priceRange: `RM${Math.min(...prices)} - RM${Math.max(...prices)}`,
    currenciesAccepted: 'MYR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.locality,
      addressRegion: settings.region,
      addressCountry: 'MY',
    },
    areaServed: allAreas.map((name) => ({ '@type': 'Place', name })),
    makesOffer: sizes.map((size) => ({
      '@type': 'Offer',
      name: size.offerName,
      price: String(size.price),
      priceCurrency: 'MYR',
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: stripInline(item.answer) },
    })),
  }

  const areaOptions = (
    <>
      {allAreas.map((name) => (
        <option key={name}>{name}</option>
      ))}
      <option value={OTHER_AREA}>{OTHER_AREA}</option>
    </>
  )

  const dayOptions = days.map((day) => (
    <option key={day} value={day}>
      {day} hari
    </option>
  ))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(businessSchema)} />
      {faqItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
      )}

      <a className="skip" href="#main">
        Terus ke kandungan utama
      </a>

      <header className="site" id="hdr">
        <div className="wrap bar">
          <a
            className="brand"
            href="#main"
            aria-label={`${settings.businessName}, ke halaman utama`}
          >
            <CmsImage media={logo} sizes="96px" loading="eager" />
          </a>
          <nav className="main" aria-label="Menu utama">
            <a href="#kerja">Kegunaan</a>
            <a href="#saiz">Saiz &amp; Harga</a>
            <a href="#cara">Cara Kerja</a>
            <a href="#kawasan">Kawasan</a>
            <a href="#soalan">Soalan</a>
            <a className="btn btn-wa" href={defaultWa}>
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <div className="hero" id="hero">
          <div className="hero-media">
            <CmsImage media={poster} sizes="100vw" preload fetchPriority="high" />
            <video
              id="hv"
              poster={poster?.url ?? undefined}
              data-src={video?.url ?? undefined}
              data-type={video?.mimeType ?? undefined}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <div className="hero-scrim" />
          <div className="wrap">
            {hero.tag && <p className="hero-tag">{hero.tag}</p>}
            <h1>
              {hero.heading.split('\n').map((line, i) => (
                <span className="l" key={i}>
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            {hero.sub && <p className="hero-sub">{hero.sub}</p>}
            <div className="hero-cta">
              <a className="btn btn-wa" href={waLink(number, hero.primaryCta.message)}>
                <WhatsAppIcon size={18} />
                {hero.primaryCta.label}
              </a>
              {hero.secondaryCtaLabel && (
                <a className="btn btn-line" href="#saiz">
                  {hero.secondaryCtaLabel}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BAR SEBUT HARGA */}
        <div className="qbar">
          <div className="wrap">
            <form id="qform" aria-label="Semakan harga pantas">
              <div className="qfield">
                <label htmlFor="q-size">Saiz tong</label>
                <select id="q-size" name="size" defaultValue={current.form}>
                  {sizes.map((size) => (
                    <option key={size.form} value={size.form}>
                      {size.short}, dari RM{size.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="qfield">
                <label htmlFor="q-area">Kawasan</label>
                <select id="q-area" name="area">
                  {areaOptions}
                </select>
              </div>
              <div className="qfield">
                <label htmlFor="q-days">Tempoh</label>
                <select id="q-days" name="days" defaultValue={defaultDays}>
                  {dayOptions}
                </select>
              </div>
              <button type="submit">
                <WhatsAppIcon size={17} />
                Semak Harga
              </button>
            </form>
          </div>
        </div>

        {/* ANGKA */}
        {home.figures && home.figures.length > 0 && (
          <div className="figures">
            <div className="wrap">
              {home.figures.map((figure, i) => (
                <div className={`fig ${rv(i)}`} key={figure.id ?? i}>
                  <p className="n">
                    {figure.prefix && <span className="u">{figure.prefix}</span>}
                    <span data-count={figure.value}>{figure.value}</span>
                    {figure.suffix && <span className="u">{figure.suffix}</span>}
                  </p>
                  <p>{figure.caption}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APA KAMI URUSKAN */}
        <section className="dark" id="kerja">
          <div className="wrap">
            <div className="work-head">
              <div>
                {work.eyebrow && <p className={`eyebrow ${rv()}`}>{work.eyebrow}</p>}
                <h2 className={rv(1)}>
                  <Lines text={work.heading} />
                </h2>
              </div>
              {work.lede && <p className={`lede ${rv(2)}`}>{work.lede}</p>}
            </div>
            <ul className="work-list">
              {(work.items ?? []).map((item, i) => (
                <li className="rv" key={item.id ?? i}>
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
            {work.note && (
              <p className="note rv">
                <InlineText text={work.note} whatsappNumber={number} />
              </p>
            )}
          </div>
        </section>

        {/* MOMEN VISUAL */}
        <div className="moment">
          <div className="moment-media">
            <CmsImage media={moment.image} id="pmx" sizes="100vw" />
          </div>
          <div className="moment-cap">
            <div className="wrap">
              {moment.label && <span>{moment.label}</span>}
              <p>{moment.text}</p>
            </div>
          </div>
        </div>

        {/* SAIZ & HARGA */}
        <section id="saiz">
          <div className="wrap">
            {home.sizes.eyebrow && <p className={`eyebrow ${rv()}`}>{home.sizes.eyebrow}</p>}
            <h2 className={rv(1)}>
              <Lines text={home.sizes.heading} />
            </h2>
            {home.sizes.lede && <p className={`lede ${rv(2)}`}>{home.sizes.lede}</p>}

            <div
              className="size-tabs rv"
              role="tablist"
              aria-label="Pilih saiz tong"
              style={{ '--size-count': sizes.length } as React.CSSProperties}
            >
              {sizes.map((size, i) => (
                <button
                  className="size-tab"
                  role="tab"
                  id={`size-tab-${i}`}
                  aria-selected={i === selected}
                  aria-controls="size-panel"
                  data-i={i}
                  type="button"
                  key={size.form}
                >
                  <BinSilhouette heightFt={size.heightFt} />
                  <span className="pr">
                    <small>dari</small>RM{size.price}
                  </span>
                  <span className="txt">
                    <span className="nm">{size.name}</span>
                    <span className="dim">
                      <b>{size.heightFt}</b>
                      {size.dimTail}
                      <span className="cap"> &middot; ±{size.capacityM3} m³</span>
                    </span>
                    {size.hint && <span className="hint">{size.hint}</span>}
                  </span>
                  <span className="tick" aria-hidden="true">
                    <TickIcon />
                  </span>
                </button>
              ))}
            </div>

            <div
              className={`sizer ${rv(1)}`}
              id="size-panel"
              role="tabpanel"
              aria-labelledby={`size-tab-${selected}`}
            >
              <div className="size-stage">
                {sizes.map((size, i) => (
                  <CmsImage
                    media={size.image}
                    alt={size.imageAlt}
                    data-i={i}
                    className={i === selected ? 'on' : undefined}
                    sizes="(max-width: 900px) 100vw, 720px"
                    key={size.form}
                  />
                ))}
              </div>
              <div className="size-info">
                <p className="size-price">
                  <span className="u">dari RM</span>
                  <span id="s-price">{current.price}</span>
                </p>
                {home.sizes.priceNote && <p className="size-note">{home.sizes.priceNote}</p>}
                <dl className="spec">
                  <div>
                    <dt>Ukuran</dt>
                    <dd id="s-dim">{current.dim}</dd>
                  </div>
                  <div>
                    <dt>Muatan</dt>
                    <dd id="s-cap">{current.cap}</dd>
                  </div>
                  <div>
                    <dt>Tempoh sewaan</dt>
                    <dd>{maxDays > 1 ? `1 hingga ${maxDays} hari` : '1 hari'}</dd>
                  </div>
                </dl>
                <p className="size-uses-k">Sesuai untuk</p>
                <ul className="size-uses" id="s-uses">
                  {current.uses.map((use) => (
                    <li key={use}>{use}</li>
                  ))}
                </ul>
                <a className="btn btn-dark" id="s-cta" href={waLink(number, current.wa)}>
                  Tempah {current.name}
                </a>
              </div>
            </div>

            <div className="size-help rv">
              <p>
                {home.sizes.help.title && <strong>{home.sizes.help.title}</strong>}{' '}
                {home.sizes.help.text}
              </p>
              <a className="btn btn-wa" href={waLink(number, home.sizes.help.cta.message)}>
                {home.sizes.help.cta.label}
              </a>
            </div>
          </div>
        </section>

        {/* CARA KERJA */}
        <section id="cara">
          <div className="wrap">
            {process.eyebrow && <p className={`eyebrow ${rv()}`}>{process.eyebrow}</p>}
            <h2 className={rv(1)}>
              <Lines text={process.heading} />
            </h2>

            <ol className="flow">
              {(process.steps ?? []).map((step, i) => (
                <li className="step" key={step.id ?? i}>
                  <div className="step-media">
                    <CmsImage media={step.image} sizes="(max-width: 900px) 100vw, 400px" />
                  </div>
                  <div className="step-rail">
                    <span className="step-num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="step-body">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* KENAPA SAIBOSS */}
        <section className="dark" id="kenapa">
          <div className="wrap">
            <div className="trust">
              <div>
                {why.eyebrow && <p className={`eyebrow ${rv()}`}>{why.eyebrow}</p>}
                <h2 className={rv(1)}>
                  <Lines text={why.heading} />
                </h2>
                {why.lede && <p className={`lede ${rv(2)}`}>{why.lede}</p>}
              </div>
              <ul className="reasons">
                {(why.reasons ?? []).map((reason, i) => (
                  <li className={rv(i)} key={reason.id ?? i}>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {why.crew && why.crew.length > 0 && (
              <div className="crew">
                {why.crew.map((photo, i) => (
                  <figure className={rv(i)} key={photo.id ?? i}>
                    <CmsImage media={photo.image} sizes="(max-width: 700px) 100vw, 600px" />
                    {photo.caption && <figcaption>{photo.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            {why.creds && why.creds.length > 0 && (
              <div className="creds rv">
                <p className="creds-k">{why.credsLabel}</p>
                <ul>
                  {why.creds.map((cred, i) => (
                    <li key={cred.id ?? i}>
                      {cred.name}
                      {cred.type && <span>{cred.type}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* KAWASAN */}
        <section
          id="kawasan"
          style={{ '--area-bg': backgroundUrl(coverage.background) } as React.CSSProperties}
        >
          <div className="wrap">
            <div className="areas-head">
              {coverage.eyebrow && <p className={`eyebrow ${rv()}`}>{coverage.eyebrow}</p>}
              <h2 className={rv(1)}>
                <Lines text={coverage.heading} />
              </h2>
              {coverage.lede && <p className={`lede ${rv(2)}`}>{coverage.lede}</p>}
            </div>

            <div className={`base-mark ${rv(2)}`}>
              <span className="base-chip">
                <span className="base-dot" />
                {coverage.baseName}
              </span>
              {coverage.baseTag && <span className="base-tag">{coverage.baseTag}</span>}
            </div>

            {areas.length > 0 && (
              <div
                className={`marquee ${rv(3)}`}
                aria-label={`Kawasan liputan ${settings.businessName}`}
              >
                {areaRows.map((row, r) => (
                  <div className="mq-row" key={r}>
                    <div className="mq-track">
                      {/* The same chips twice, so the track can loop at exactly -50%. */}
                      {[false, true].map((duplicate) => (
                        <div
                          className="mq-group"
                          aria-hidden={duplicate || undefined}
                          key={String(duplicate)}
                        >
                          {row.map((name) => (
                            <span key={name}>{name}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {coverage.note && (
              <p className={`area-note ${rv(3)}`}>
                <InlineText text={coverage.note} whatsappNumber={number} />
              </p>
            )}
          </div>
        </section>

        {/* SOALAN */}
        <section id="soalan">
          <div className="wrap">
            {faq.eyebrow && <p className={`eyebrow ${rv()}`}>{faq.eyebrow}</p>}
            <h2 className={rv(1)}>
              <Lines text={faq.heading} />
            </h2>
            <div className={`faq ${rv(2)}`}>
              {faqItems.map((item, i) => (
                <details key={item.id ?? i}>
                  <summary>
                    {item.question}
                    <span className="ic" />
                  </summary>
                  <p>
                    <InlineText text={item.answer} whatsappNumber={number} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPAHAN */}
        <section
          className="dark"
          id="tempah"
          style={{ '--book-bg': backgroundUrl(booking.background) } as React.CSSProperties}
        >
          <div className="wrap">
            <div className="book">
              <div>
                {booking.eyebrow && <p className={`eyebrow ${rv()}`}>{booking.eyebrow}</p>}
                <h2 className={rv(1)}>
                  <Lines text={booking.heading} />
                </h2>
                <ul className={`book-points ${rv(2)}`}>
                  {(booking.points ?? []).map((point, i) => (
                    <li key={point.id ?? i}>{point.text}</li>
                  ))}
                </ul>
                <p className={`tel ${rv(3)}`}>
                  {booking.callText} <a href={tel}>{settings.phoneDisplay}</a>
                </p>
              </div>
              <form className={`book-form ${rv(1)}`} id="bform" aria-labelledby="bk-t">
                <h3 id="bk-t">{booking.formTitle}</h3>
                {booking.formSub && <p className="sm">{booking.formSub}</p>}
                <div className="field">
                  <label htmlFor="b-size">Saiz tong</label>
                  <select id="b-size" required defaultValue={current.form}>
                    {sizes.map((size) => (
                      <option key={size.form} value={size.form}>
                        {size.nameLower}, {size.dim}, dari RM{size.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="b-area">Kawasan</label>
                  <select id="b-area" required>
                    {areaOptions}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="b-days">Tempoh sewaan</label>
                  <select id="b-days" required defaultValue={defaultDays}>
                    {dayOptions}
                  </select>
                </div>
                {booking.wasteTypes && booking.wasteTypes.length > 0 && (
                  <div className="field">
                    <label htmlFor="b-waste">Jenis sisa (pilihan)</label>
                    <select id="b-waste">
                      <option value="">Pilih jika berkenaan</option>
                      {booking.wasteTypes.map((waste, i) => (
                        <option key={waste.id ?? i}>{waste.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button className="btn btn-wa" type="submit">
                  <WhatsAppIcon size={18} />
                  Tempah Melalui WhatsApp
                </button>
                {booking.formFine && <p className="fine">{booking.formFine}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap">
          <div className="grid">
            <div>
              <CmsImage media={logo} className="fl" sizes="96px" />
              {settings.footerDescription && <p>{settings.footerDescription}</p>}
              {settings.footerDescriptionEn && <p className="en">{settings.footerDescriptionEn}</p>}
            </div>
            <div>
              <h2>Halaman</h2>
              <ul>
                <li>
                  <a href="#kerja">Kegunaan</a>
                </li>
                <li>
                  <a href="#saiz">Saiz &amp; harga</a>
                </li>
                <li>
                  <a href="#cara">Cara kerja</a>
                </li>
                <li>
                  <a href="#kawasan">Kawasan</a>
                </li>
                <li>
                  <a href="#soalan">Soalan lazim</a>
                </li>
                <li>
                  <a href="#tempah">Tempahan</a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Hubungi</h2>
              <ul>
                <li>
                  <a href={tel}>{settings.phoneDisplay}</a>
                </li>
                <li>
                  <a href={defaultWa}>WhatsApp {settings.phoneDisplay}</a>
                </li>
                <li>
                  {settings.locality}, {settings.region}, Malaysia
                </li>
              </ul>
            </div>
          </div>
          <p className="base">
            © {new Date().getFullYear()} {settings.businessName}. Hak cipta terpelihara.
          </p>
        </div>
      </footer>

      <a
        className="wa"
        id="wa"
        href={defaultWa}
        aria-label={`Hubungi ${settings.businessName} melalui WhatsApp`}
      >
        <WhatsAppIcon />
      </a>

      <SiteScript
        sizes={sizes.map(({ name, price, dim, cap, form, uses, wa }) => ({
          name,
          price,
          dim,
          cap,
          form,
          uses,
          wa,
        }))}
        waBase={waBase(number)}
        greeting={settings.whatsappGreeting}
      />
    </>
  )
}
