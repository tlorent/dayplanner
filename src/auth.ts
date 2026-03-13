// Hardcoded users — replace passwords before sharing
export const USERS: Record<string, string> = {
  tim: 'hardewerker$tim',
  lilith: 'hardewerker$lilith',
}

const SESSION_KEY = 'dayplanner_user'

export function login(username: string, password: string): boolean {
  const expected = USERS[username.toLowerCase()]
  if (expected && expected === password) {
    localStorage.setItem(SESSION_KEY, username.toLowerCase())
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}
