import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

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

                const response = await axios.get(
                    `http://localhost:8080/api/pastes/${id}`
                )

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
        return <main className="main">Loading paste...</main>
    }

    if (error) {
        return (
            <main className="main">
                <h1>Sniply</h1>
                <p className="error-message">{error}</p>
            </main>
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
            <header className="navbar">
                <h1 className="logo">Sniply</h1>
                <span className="tagline">Share text. Share code.</span>
            </header>

            <main className="main">
                <section className="hero">
                    <h2>Your snippet</h2>
                    <p>Shared with Sniply.</p>

                </section>

                <section className="paste-card">
                    <div className="paste-actions">
                        <span>Shared snippet</span>

                        <button type="button" onClick={handleCopyContent}>
                            {copied ? 'Copied!' : 'Copy Content'}
                        </button>
                    </div>

                    <pre className="paste-content">{paste.content}</pre>
                </section>
                <Link to="/" className="back-link">
                    ← Create another paste
                </Link>
            </main>

            <footer className="footer">Built with Sniply</footer>
        </div>
    )
}

export default SharePaste
