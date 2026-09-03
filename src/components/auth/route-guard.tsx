import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import type { Role } from '../../lib/types'

export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />
  return <Outlet />
}

export function PublicOnly() {
  const { currentUser } = useAuth()
  if (!currentUser) return <Outlet />
  return <Navigate to={currentUser.role === 'student' ? '/student' : '/'} replace />
}

export function RequireRole({ role }: { role: Role }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'student' ? '/student' : '/'} replace />
  return <Outlet />
}
