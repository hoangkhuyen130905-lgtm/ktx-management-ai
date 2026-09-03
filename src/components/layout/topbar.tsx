import { ChevronDown, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NotificationCenter } from './notification-center'
import { useAuth } from '../../context/auth-context'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const { currentUser, logout } = useAuth()
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  if (!currentUser) return null
  const initials = currentUser.displayName.split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase()
  return <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu-button" type="button" aria-label="Mở menu" onClick={onMenuClick}><Menu size={20} /></button><div className="search-box"><Search className="search-icon" size={16} aria-hidden="true" /><input aria-label="Tìm kiếm toàn hệ thống" placeholder={currentUser.role === 'admin' ? 'Tìm sinh viên, phòng, hóa đơn...' : 'Tìm trong thông tin của tôi...'} /><kbd className="shortcut">⌘ K</kbd></div></div><div className="topbar-right"><button className="icon-button" type="button" aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} onClick={() => setDark((value) => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><NotificationCenter /><div className="user-menu"><span className="avatar" aria-hidden="true">{initials}</span><div className="user-copy"><strong className="user-name">{currentUser.displayName}</strong><span className="user-role">{currentUser.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}</span></div><ChevronDown size={15} color="var(--foreground-muted)" aria-hidden="true" /><button className="icon-button logout-button" type="button" aria-label="Đăng xuất" onClick={logout}><LogOut size={16} /></button></div></div></header>
}
