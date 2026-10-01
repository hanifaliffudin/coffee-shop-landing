import { useEffect, useRef, useState } from 'react'
import './App.css'

type MenuCategory = 'espresso' | 'slow-bar' | 'house-drinks' | 'pastries'

type MenuItem = {
  name: string
  description: string
  price: string
}

type MenuGroup = {
  id: MenuCategory
  label: string
  note: string
  items: MenuItem[]
}

type BrewNote = {
  number: string
  name: string
  profile: string
  bestFor: string
}

const menuGroups: MenuGroup[] = [
  {
    id: 'espresso',
    label: 'Espresso',
    note: 'Comforting, familiar, and built on a balanced house roast.',
    items: [
      { name: 'Espresso', description: 'Double shot, syrupy body', price: '$3.50' },
      { name: 'Piccolo', description: 'Espresso, steamed milk, 4 oz', price: '$4.25' },
      { name: 'Flat White', description: 'Double ristretto, fine microfoam', price: '$5.00' },
      { name: 'Mocha', description: 'Espresso, dark cocoa, steamed milk', price: '$5.50' },
    ],
  },
  {
    id: 'slow-bar',
    label: 'Slow Bar',
    note: 'Clear, aromatic cups brewed one at a time at the counter.',
    items: [
      { name: 'V60', description: 'Bright, clean, and lightly textured', price: '$6.00' },
      { name: 'Kalita Wave', description: 'Round sweetness, steady finish', price: '$6.00' },
      { name: 'Aeropress', description: 'Dense, smooth, and direct', price: '$5.50' },
      { name: 'Batch Brew', description: 'Daily filter coffee, served quickly', price: '$4.00' },
    ],
  },
  {
    id: 'house-drinks',
    label: 'House Drinks',
    note: 'Coffee-forward recipes with restrained sweetness.',
    items: [
      { name: 'Ember Tonic', description: 'Espresso, tonic, charred orange', price: '$6.50' },
      { name: 'Maple Oat Cortado', description: 'Ristretto, oat milk, maple', price: '$5.75' },
      { name: 'Cold Cocoa', description: 'Cold brew, cocoa, sea salt cream', price: '$6.25' },
      { name: 'Spiced Cascara', description: 'Cascara, cinnamon, sparkling water', price: '$5.50' },
    ],
  },
  {
    id: 'pastries',
    label: 'Pastries',
    note: 'A short counter selection for a quiet coffee break.',
    items: [
      { name: 'Almond Croissant', description: 'Toasted almond, crisp laminated layers', price: '$5.25' },
      { name: 'Brown Butter Financier', description: 'Almond cake, browned butter', price: '$4.25' },
      { name: 'Dark Chocolate Cookie', description: 'Dark chocolate, smoked salt', price: '$4.00' },
      { name: 'Orange Olive Oil Cake', description: 'Citrus, olive oil, soft crumb', price: '$4.75' },
    ],
  },
]

const brewNotes: BrewNote[] = [
  {
    number: '01',
    name: 'Soft and chocolate-led',
    profile: 'Cocoa, toasted almond, brown sugar',
    bestFor: 'Flat white or espresso',
  },
  {
    number: '02',
    name: 'Bright and tea-like',
    profile: 'Orange peel, jasmine, honey',
    bestFor: 'V60 or batch brew',
  },
  {
    number: '03',
    name: 'Deep and fruit-forward',
    profile: 'Black cherry, cacao nib, molasses',
    bestFor: 'Aeropress or iced coffee',
  },
  {
    number: '04',
    name: 'Clean and mellow',
    profile: 'Pear, cashew, caramel',
    bestFor: 'Kalita Wave or cortado',
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('espresso')
  const [activeNote, setActiveNote] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const menuToggleRef = useRef<HTMLButtonElement | null>(null)

  const selectedMenu = menuGroups.find((group) => group.id === activeCategory) ?? menuGroups[0]
  const selectedNote = brewNotes[activeNote]

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 36)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen((isOpen) => {
          if (isOpen) requestAnimationFrame(() => menuToggleRef.current?.focus())
          return false
        })
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    const revealNodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 },
    )

    revealNodes.forEach((node) => {
      node.classList.add('reveal-ready')
      observer.observe(node)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      observer.disconnect()
    }
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const changeNote = (direction: number) => {
    setActiveNote((current) => (current + direction + brewNotes.length) % brewNotes.length)
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % menuGroups.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + menuGroups.length) % menuGroups.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = menuGroups.length - 1
    else return

    event.preventDefault()
    setActiveCategory(menuGroups[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={`site-header${headerScrolled || mobileMenuOpen ? ' is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <a className="wordmark" href="#top" onClick={closeMobileMenu}>
            Emberline
            <span>Coffee</span>
          </a>

          <nav
            id="mobile-navigation"
            className={`primary-nav${mobileMenuOpen ? ' is-open' : ''}`}
            aria-label="Primary navigation"
          >
            <a href="#story" onClick={closeMobileMenu}>Our approach</a>
            <a href="#menu" onClick={closeMobileMenu}>Menu</a>
            <a href="#notes" onClick={closeMobileMenu}>Find your cup</a>
          </nav>

          <button
            ref={menuToggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span className="menu-toggle__label" aria-hidden="true">
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </span>
            <span className="menu-toggle__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__media" aria-hidden="true" />
          <div className="hero__shade" />
          <div className="hero__content">
            <p className="hero__kicker">Espresso and slow bar</p>
            <h1 id="hero-title">Coffee for slow mornings and sharp afternoons.</h1>
            <p className="hero__intro">
              Emberline pairs measured brewing with the warmth of a neighborhood counter.
              Choose a familiar espresso or stay for a careful pour-over.
            </p>
            <a className="button button--accent" href="#menu">Browse the menu</a>
          </div>
          <div className="hero__folio" aria-hidden="true">
            <span>01</span>
            <span className="hero__folio-line" />
            <span>05</span>
          </div>
        </section>

        <section className="story" id="story" aria-labelledby="story-title">
          <div className="story__image-wrap" data-reveal>
            <picture>
              <source
                type="image/avif"
                srcSet="/images/emberline-ritual-mobile.avif 768w, /images/emberline-ritual.avif 1536w"
                sizes="(max-width: 900px) 100vw, 52.5vw"
              />
              <img
                src="/images/emberline-ritual.jpg"
                srcSet="/images/emberline-ritual-mobile.jpg 768w, /images/emberline-ritual.jpg 1536w"
                sizes="(max-width: 900px) 100vw, 52.5vw"
                alt="Barista pouring water through a ceramic coffee dripper"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </picture>
            <span className="image-caption">A steady pour keeps the cup clear and balanced.</span>
          </div>
          <div className="story__copy" data-reveal>
            <p className="section-number" aria-hidden="true">02</p>
            <p className="section-kicker">Our approach</p>
            <h2 id="story-title">Good coffee rewards attention.</h2>
            <p>
              We weigh every dose, watch the water, and stop before bitterness takes over.
              The technique stays precise so the cup can feel easy.
            </p>
            <dl className="method-list">
              <div>
                <dt>Espresso</dt>
                <dd>Dense sweetness and a clean finish</dd>
              </div>
              <div>
                <dt>Filter</dt>
                <dd>Open aroma and a lighter texture</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="menu-section" id="menu" aria-labelledby="menu-title">
          <div className="menu-heading" data-reveal>
            <p className="section-number" aria-hidden="true">03</p>
            <div>
              <p className="section-kicker">Sample concept menu</p>
              <h2 id="menu-title">Pick the pace of your cup.</h2>
            </div>
            <p>Start quick at the espresso bar or give a hand brew a few quiet minutes.</p>
          </div>

          <div className="menu-explorer" data-reveal>
            <div className="menu-tabs" role="tablist" aria-label="Menu categories">
              {menuGroups.map((group, index) => (
                <button
                  key={group.id}
                  ref={(element) => { tabRefs.current[index] = element }}
                  className={activeCategory === group.id ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  id={`tab-${group.id}`}
                  aria-selected={activeCategory === group.id}
                  aria-controls="menu-panel"
                  tabIndex={activeCategory === group.id ? 0 : -1}
                  onClick={() => setActiveCategory(group.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {group.label}
                </button>
              ))}
            </div>

            <div
              className="menu-panel"
              role="tabpanel"
              id="menu-panel"
              aria-labelledby={`tab-${selectedMenu.id}`}
              tabIndex={0}
            >
              <p className="menu-panel__note">{selectedMenu.note}</p>
              <ul className="menu-list">
                {selectedMenu.items.map((item) => (
                  <li key={item.name}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="pairing" aria-labelledby="pairing-title">
          <picture>
            <source
              type="image/avif"
              srcSet="/images/emberline-pairing-mobile.avif 768w, /images/emberline-pairing.avif 1536w"
              sizes="(max-width: 900px) 100vw, 47.5vw"
            />
            <img
              src="/images/emberline-pairing.jpg"
              srcSet="/images/emberline-pairing-mobile.jpg 768w, /images/emberline-pairing.jpg 1536w"
              sizes="(max-width: 900px) 100vw, 47.5vw"
              alt="Flat white and almond croissant on cream linen"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </picture>
          <div className="pairing__content" data-reveal>
            <p className="section-kicker">A quiet pairing</p>
            <h2 id="pairing-title">Flat white.<br />Almond croissant.</h2>
            <p>Round espresso, fine microfoam, and crisp pastry layers. A simple match that leaves room for the coffee.</p>
            <a className="text-link" href="#menu">See pastries on the menu</a>
          </div>
        </section>

        <section className="notes" id="notes" aria-labelledby="notes-title">
          <div className="notes__heading" data-reveal>
            <p className="section-number" aria-hidden="true">04</p>
            <p className="section-kicker">Find your cup</p>
            <h2 id="notes-title">Choose by flavor, not jargon.</h2>
          </div>

          <div className="notes__stage" data-reveal>
            <p className="notes__count" aria-hidden="true">{selectedNote.number} / 04</p>
            <div className="notes__current" aria-live="polite" aria-atomic="true">
              <h3>{selectedNote.name}</h3>
              <dl>
                <div>
                  <dt>Tastes like</dt>
                  <dd>{selectedNote.profile}</dd>
                </div>
                <div>
                  <dt>Try it as</dt>
                  <dd>{selectedNote.bestFor}</dd>
                </div>
              </dl>
            </div>
            <div className="notes__controls">
              <button type="button" onClick={() => changeNote(-1)} aria-label="Show previous flavor profile">Previous</button>
              <button type="button" onClick={() => changeNote(1)} aria-label="Show next flavor profile">Next</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#top">
          Emberline
          <span>Coffee</span>
        </a>
        <p>A fictional café concept. Menu and prices are shown for demonstration.</p>
        <nav aria-label="Footer navigation">
          <a href="#story">Our approach</a>
          <a href="#menu">Menu</a>
          <a href="#notes">Find your cup</a>
        </nav>
        <p className="site-footer__mark">Small cups, long conversations.</p>
      </footer>
    </div>
  )
}

export default App
