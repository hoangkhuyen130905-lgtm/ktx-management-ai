import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { repository } from '../data/mock/mock-repository'
import { useAuth } from './auth-context'
import type { Notification } from '../lib/types'

type AppContextValue = { notifications: Notification[]; unreadCount: number; markNotificationRead: (id: string) => Promise<void>; markAllNotificationsRead: () => Promise<void>; refreshNotifications: () => Promise<void> }
const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const refreshNotifications = async () => setNotifications(await repository.listNotifications(currentUser?.role))
  useEffect(() => { void refreshNotifications() }, [currentUser?.role])
  const value = useMemo<AppContextValue>(() => ({ notifications, unreadCount: notifications.filter((item) => !item.read).length, markNotificationRead: async (id) => { await repository.markNotificationRead(id); await refreshNotifications() }, markAllNotificationsRead: async () => { await repository.markAllNotificationsRead(currentUser?.role); await refreshNotifications() }, refreshNotifications }), [notifications, currentUser?.role])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() { const value = useContext(AppContext); if (!value) throw new Error('useAppContext phải được dùng trong AppProvider.'); return value }
