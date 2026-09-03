import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { findDemoAccount } from '../data/mock/auth-fixtures'
import type { AuthUser, Session } from '../lib/types'

const SESSION_KEY = 'ktx-session'
const SESSION_VERSION = 1 as const

type AuthContextValue = {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    if (session.version !== SESSION_VERSION || !session.user?.id || !session.user.role || !session.user.username) throw new Error('Invalid session')
    return session.user
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(readSession)
  const value = useMemo<AuthContextValue>(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    async login(username, password) {
      const user = findDemoAccount(username, password)
      if (!user) return false
      const session: Session = { version: SESSION_VERSION, user }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setCurrentUser(user)
      return true
    },
    logout() {
      localStorage.removeItem(SESSION_KEY)
      setCurrentUser(null)
    },
  }), [currentUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth phải được dùng trong AuthProvider.')
  return value
}
