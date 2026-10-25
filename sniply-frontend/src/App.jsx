
import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import SharePaste from './SharePaste'

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

      const response = await axios.post(
        'http://localhost:8080/api/pastes',
        {
          content,
          expiresAt,
        }
      )

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
      <header className="navbar">
        <h1 className="logo">Sniply</h1>
        <span className="tagline">Share text. Share code.</span>
      </header>

      <main className="main">
        <section className="hero">
          <h2>Share your snippets.</h2>
          <p>Create a paste and share it with anyone using a simple link.</p>
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
            <span className={content.length >= MAX_CHARACTERS ? 'char-limit' : ''}>
              {content.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
            </span>
            <button
              type="button"
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

                <button type="button" onClick={handleCopyLink}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">Built with Sniply</footer>
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
