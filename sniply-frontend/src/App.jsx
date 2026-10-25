import { useState } from 'react'
import api from './api/axios'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import SharePaste from './SharePaste'

const SOCIALS = {
  github: 'https://github.com/ajeetverma01',
  linkedin: 'https://www.linkedin.com/in/ajeetverma01',
  portfolio: 'https://ajeetverma.netlify.app',
}

const FEATURES = [
  { icon: '⚡', title: 'Instant links', text: 'Paste, click, share. Your link is ready in under a second.' },
  { icon: '⏳', title: 'Self-destructing', text: 'Choose 1 hour, 24 hours, or keep it forever.' },
  { icon: '🔓', title: 'No sign-up', text: 'No accounts, no email, no friction. Just your snippet.' },
  { icon: '📋', title: 'One-click copy', text: 'Copy the link or the full content with a single tap.' },
]

const STEPS = [
  { title: 'Paste', text: 'Drop in any text, notes, or code.' },
  { title: 'Pick an expiry', text: 'Decide how long the link should live.' },
  { title: 'Share', text: 'Send the link to anyone, anywhere.' },
]

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-credit">
        Made with <span className="heart">♥</span> by <strong>Ajeet Verma</strong>
      </p>
      <div className="socials">
        <a href={SOCIALS.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={SOCIALS.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
      </div>
      <p className="footer-small">© {new Date().getFullYear()} Sniply. Share text. Share code.</p>
    </footer>
  )
}

function Home() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paste, setPaste] = useState(null)
  const [copied, setCopied] = useState(false)
  const [expiration, setExpiration] = useState('never')
  const MAX_CHARACTERS = 100000

  async function handleCreatePaste() {
    if (!content.trim()) {
      setError('Please enter some text or code.')
      return
    }

    setLoading(true)
    setError('')
    setPaste(null)

    try {
      const expiresAt =
        expiration === 'never'
          ? null
          : new Date(
            Date.now() +
            (expiration === '1h' ? 60 : 1440) * 60 * 1000
          ).toISOString()

      const response = await api.post('/api/pastes', {
        content,
        expiresAt,
      })

      setPaste({
        ...response.data,
        shareableUrl: `${window.location.origin}/p/${response.data.id}`,
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create paste. Check your backend connection.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(paste.shareableUrl)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setError('Could not copy the link. Please copy it manually.')
    }
  }

  return (
    <div className="app">
      <div className="aurora" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">&lt;/&gt;</span> Sniply
        </Link>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#how">How it works</a>
          <a href={SOCIALS.github} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h2>
            Share your <span className="gradient-text">snippets</span>
            <span className="cursor" aria-hidden="true">|</span>
          </h2>
          <p>Create a paste and share it with anyone using a simple link. Fast, free, and private by design.</p>
        </section>

        <section className="paste-card">
          <label htmlFor="paste-content">Your content</label>

          <textarea
            id="paste-content"
            placeholder="Paste your text or code here..."
            value={content}
            maxLength={MAX_CHARACTERS}
            onChange={(event) => setContent(event.target.value)}
          />
          <div className="expiration-field">
            <label htmlFor="expiration">Expiration</label>

            <select
              id="expiration"
              value={expiration}
              onChange={(event) => setExpiration(event.target.value)}
            >
              <option value="never">Never expires</option>
              <option value="1h">After 1 hour</option>
              <option value="24h">After 24 hours</option>
            </select>
          </div>

          <div className="paste-actions">
            <span className={content.length >= MAX_CHARACTERS ? 'char-limit' : 'char-count'}>
              {content.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
            </span>
            <button
              type="button"
              className="btn-primary"
              onClick={handleCreatePaste}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Paste'}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {paste && (
            <div className="success-message">
              <p>Paste created successfully!</p>

              <div className="share-link">
                <a
                  href={paste.shareableUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {paste.shareableUrl}
                </a>

                <button type="button" className="btn-ghost" onClick={handleCopyLink}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section id="about" className="section">
          <h3>About Sniply</h3>
          <p className="section-lead">
            Sniply is a tiny tool for sending text and code to other people without the clutter.
            Developers use it to share bug logs and config files, students use it for notes,
            and teams use it to pass around quick drafts. No account, no ads, just a link.
          </p>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <article className="feature" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="section">
          <h3>How it works</h3>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.title}>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:id" element={<SharePaste />} />
    </Routes>
  )
}

export default App