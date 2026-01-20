import { useMemo, useState } from 'react'
import './my-app.css'

type View = 'intro' | 'story' | 'gallery' | 'rsvp'

const timeline = [
  { date: '2024.03', title: 'First Message', detail: 'A late-night playlist and a small hello.' },
  { date: '2024.06', title: 'First Trip', detail: 'Two backpacks, one tiny train ride.' },
  { date: '2024.11', title: 'The Promise', detail: 'A ring of light on the riverside.' },
]

const stats = [
  { label: 'Days Together', value: '612' },
  { label: 'Shared Songs', value: '128' },
  { label: 'Cups of Coffee', value: '249' },
]

function MyApp() {
  const [view, setView] = useState<View>('intro')
  const [name, setName] = useState('')

  const heading = useMemo(() => {
    if (view === 'story') return 'Our tiny timeline'
    if (view === 'gallery') return 'Fragments of the journey'
    if (view === 'rsvp') return 'Leave a love note'
    return 'Love Story Lab'
  }, [view])

  return (
    <main className="love">
      <section className="love__card love__hero">
        <span className="love__eyebrow">2025 Love Test Project</span>
        <h1 className="love__title">{heading}</h1>
        <p className="love__subtitle">
          This small app verifies multi-project dev, isolated builds, and deployments. Navigation
          stays inside the page, so the URL remains <strong>/20250121_love/</strong>.
        </p>

        <div className="love__nav">
          {[
            { key: 'intro', label: 'Overview' },
            { key: 'story', label: 'Timeline' },
            { key: 'gallery', label: 'Gallery' },
            { key: 'rsvp', label: 'RSVP' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={view === item.key ? 'is-active' : ''}
              onClick={() => setView(item.key as View)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="love__card">
        {view === 'intro' ? (
          <div className="love__panel">
            <h2>Project Snapshot</h2>
            <div className="love__stats">
              {stats.map((item) => (
                <div className="love__stat" key={item.label}>
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            <p className="love__notes">
              Switching tabs does not touch browser history, making this a clean SPA test case.
            </p>
          </div>
        ) : null}

        {view === 'story' ? (
          <div className="love__panel">
            <h2>Timeline</h2>
            <div className="love__timeline">
              {timeline.map((item) => (
                <div className="love__timeline-item" key={item.date}>
                  <strong>
                    {item.date} · {item.title}
                  </strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {view === 'gallery' ? (
          <div className="love__panel">
            <h2>Gallery</h2>
            <div className="love__gallery">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="love__photo" key={`photo-${index}`} />
              ))}
            </div>
          </div>
        ) : null}

        {view === 'rsvp' ? (
          <div className="love__panel">
            <h2>RSVP</h2>
            <div className="love__cta">
              <input
                className="love__input"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <button
                className="love__submit"
                type="button"
                onClick={() => setName('')}
              >
                Send a Wish
              </button>
              <p className="love__notes">
                {name ? `Hello ${name}, thanks for your blessing!` : 'Leave a name to test input.'}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default MyApp
