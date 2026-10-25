import { useEffect, useState } from 'react'
import api from './api/axios'
import { Link, useParams } from 'react-router-dom'

const SOCIALS = {
    github: 'https://github.com/ajeetverma01',
    linkedin: 'https://www.linkedin.com/in/ajeetverma01',
    portfolio: 'https://ajeetverma.netlify.app',
}

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

function Background() {
    return (
        <div className="aurora" aria-hidden="true">
            <span className="blob blob-1" />
            <span className="blob blob-2" />
            <span className="blob blob-3" />
        </div>
    )
}

function SharePaste() {
    const { id } = useParams()

    const [paste, setPaste] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        async function fetchPaste() {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(`/api/pastes/${id}`)

                setPaste(response.data)
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Paste not found or has expired.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchPaste()
    }, [id])

    if (loading) {
        return (
            <div className="app">
                <Background />
                <main className="main center-state">
                    <div className="spinner" aria-hidden="true" />
                    <p>Loading paste...</p>
                </main>
            </div>
        )
    }

    if (error && !paste) {
        return (
            <div className="app">
                <Background />
                <main className="main center-state">
                    <Link to="/" className="logo">
                        <span className="logo-mark">&lt;/&gt;</span> Sniply
                    </Link>
                    <p className="error-message">{error}</p>
                    <Link to="/" className="back-link">← Create a new paste</Link>
                </main>
                <Footer />
            </div>
        )
    }

    async function handleCopyContent() {
        try {
            await navigator.clipboard.writeText(paste.content)
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch {
            setError('Could not copy the content. Please copy it manually.')
        }
    }

    return (
        <div className="app">
            <Background />

            <header className="navbar">
                <Link to="/" className="logo">
                    <span className="logo-mark">&lt;/&gt;</span> Sniply
                </Link>
                <span className="tagline">Share text. Share code.</span>
            </header>

            <main className="main">
                <section className="hero">
                    <h2>
                        Your <span className="gradient-text">snippet</span>
                    </h2>
                    <p>Shared with Sniply. Copy it, use it, make it yours.</p>
                </section>

                <section className="paste-card">
                    <div className="paste-actions">
                        <span className="window-dots" aria-hidden="true">
                            <i /><i /><i />
                        </span>
                        <span className="char-count">Shared snippet</span>

                        <button type="button" className="btn-primary" onClick={handleCopyContent}>
                            {copied ? 'Copied!' : 'Copy Content'}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <pre className="paste-content">{paste.content}</pre>
                </section>

                <Link to="/" className="back-link">
                    ← Create another paste
                </Link>
            </main>

            <Footer />
        </div>
    )
}

export default SharePaste