import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import './index.css'
import {
  StackHandler,
  StackProvider,
  StackTheme,
  useUser,
} from '@stackframe/react'
import App from './App'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { stackClientApp } from './stack/client'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser({ or: 'return-null' })
  if (user === null) return <Navigate to="/" replace />
  if (user === undefined) return null
  return <>{children}</>
}

function HandlerRoutes() {
  const location = useLocation()
  return <StackHandler location={location.pathname} fullPage />
}

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed by index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StackProvider app={stackClientApp}>
        <StackTheme
          theme={{
            dark: {
              background: '#0C0C0C',
              foreground: '#E0E0E0',
              card: '#1A1A1A',
              cardForeground: '#E0E0E0',
              popover: '#111111',
              popoverForeground: '#E0E0E0',
              primary: '#C8922A',
              primaryForeground: '#0C0C0C',
              secondary: '#252525',
              secondaryForeground: '#E0E0E0',
              muted: '#202020',
              mutedForeground: '#808080',
              accent: '#252525',
              accentForeground: '#E0E0E0',
              destructive: '#c0392b',
              destructiveForeground: '#E0E0E0',
              border: '#242424',
              input: '#242424',
              ring: '#C8922A',
            },
            radius: '0.5rem',
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/handler/*" element={<HandlerRoutes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StackTheme>
      </StackProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
