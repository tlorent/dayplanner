import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth'
import { Logo } from '../components/Logo'

export default function Landing() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/app')
    } else {
      setError('Wrong username or password.')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Logo size={36} />
            <h1 className="font-display font-extrabold text-4xl text-white/90 m-0" style={{ letterSpacing: '-1px' }}>
              Dunzo
            </h1>
          </div>
          <p className="text-[14px] text-white/70">Don't be on the list. Get it done.</p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="bg-elevated rounded-xl px-8 py-8 flex flex-col gap-5"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold tracking-wide text-white/50 uppercase">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              className="bg-card rounded-lg px-3.5 py-2.5 text-[14px] text-white/90 outline-none placeholder:text-white/20 focus:ring-1 focus:ring-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="tim"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold tracking-wide text-white/50 uppercase">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="bg-card rounded-lg px-3.5 py-2.5 text-[14px] text-white/90 outline-none placeholder:text-white/20 focus:ring-1 focus:ring-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-400/80">{error}</p>
          )}

          <button
            type="submit"
            className="mt-1 w-full py-2.5 rounded-lg font-ui font-semibold text-[14px] text-white/90 bg-white/10 hover:bg-white/15 transition-colors duration-150 cursor-pointer border-none"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
