import { Bell, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/app-context'

export function NotificationCenter() {
  const [open, setOpen] = useState(false); const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAppContext()
  return <div className="notification-wrap"><button className="icon-button" type="button" aria-label={`Thông báo${unreadCount ? `, ${unreadCount} chưa đọc` : ''}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={18} />{unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}</button>{open && <div className="notification-popover" role="dialog" aria-label="Danh sách thông báo"><div className="notification-header"><div><strong>Thông báo</strong><span>{unreadCount} chưa đọc</span></div><button className="notification-mark-all" type="button" onClick={() => void markAllNotificationsRead()}><Check size={13} /> Đọc tất cả</button></div><div className="notification-list">{notifications.length === 0 ? <div className="empty-state">Chưa có thông báo.</div> : notifications.map((item) => <div className={`notification-item${item.read ? '' : ' unread'}`} key={item.id}><span className="notification-indicator" /><div className="notification-copy"><strong>{item.title}</strong><p>{item.message}</p><span>{item.createdAt}</span></div>{item.href && <Link to={item.href} onClick={() => { void markNotificationRead(item.id); setOpen(false) }} aria-label={`Mở ${item.title}`}><ExternalLink size={14} /></Link>}</div>)}</div></div>}</div>
}
