import { useStackApp } from '@stackframe/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

export default function Login() {
  const app = useStackApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await app.signInWithCredential({ email, password })
    setLoading(false)
    if (result.status === 'error') {
      setError('Wrong email or password.')
    } else {
      navigate('/app')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 mb-2 no-underline"
          >
            <Logo size={36} />
            <h1
              className="font-display font-extrabold text-4xl text-white/90 m-0"
              style={{ letterSpacing: '-1px' }}
            >
              Dunzo
            </h1>
          </Link>
          <p className="text-[14px] text-white/50 mt-2">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-elevated rounded-xl px-8 py-8 flex flex-col gap-5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-[12px] font-semibold tracking-wide text-white/50 uppercase"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="bg-card rounded-lg px-3.5 py-2.5 text-[14px] text-white/90 outline-none placeholder:text-white/20 focus:ring-1 focus:ring-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-[12px] font-semibold tracking-wide text-white/50 uppercase"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="bg-card rounded-lg px-3.5 py-2.5 text-[14px] text-white/90 outline-none placeholder:text-white/20 focus:ring-1 focus:ring-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-[13px] text-red-400/80 m-0">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-lg font-ui font-semibold text-[14px] text-white/90 bg-white/10 hover:bg-white/15 transition-colors duration-150 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-[13px] text-white/40 m-0">
            No account?{' '}
            <Link
              to="/signup"
              className="text-white/70 hover:text-white/90 transition-colors duration-150 no-underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
