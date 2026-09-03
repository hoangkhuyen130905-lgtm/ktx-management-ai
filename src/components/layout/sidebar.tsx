import { NavLink } from 'react-router-dom'
import { BarChart3, BedDouble, Building2, ClipboardList, CreditCard, FileText, Headphones, LayoutDashboard, LifeBuoy, Settings, Users } from 'lucide-react'
import { useAuth } from '../../context/auth-context'

const adminNavigation = [
  { label: 'Tổng quan', href: '/', icon: LayoutDashboard }, { label: 'Sinh viên', href: '/residents', icon: Users, badge: '10' }, { label: 'Tòa nhà & phòng', href: '/rooms', icon: Building2 }, { label: 'Đăng ký ở', href: '/applications', icon: ClipboardList, badge: '3' }, { label: 'Hợp đồng', href: '/contracts', icon: FileText }, { label: 'Hóa đơn & thu phí', href: '/payments', icon: CreditCard }, { label: 'Sự cố & bảo trì', href: '/maintenance', icon: Headphones, badge: '2' },
]
const studentNavigation = [
  { label: 'Tổng quan cá nhân', href: '/student', icon: LayoutDashboard }, { label: 'Đăng ký ở', href: '/student#applications', icon: ClipboardList }, { label: 'Hợp đồng', href: '/student#contract', icon: FileText }, { label: 'Hóa đơn', href: '/student#payments', icon: CreditCard },
]

export function Sidebar({ onHelpClick }: { onHelpClick?: () => void }) {
  const { currentUser } = useAuth()
  const isStudent = currentUser?.role === 'student'
  const navigation: Array<{ label: string; href: string; icon: typeof LayoutDashboard; badge?: string }> = isStudent ? studentNavigation : adminNavigation
  return <aside className="sidebar" aria-label="Điều hướng chính"><div className="brand"><img className="brand-logo" src="/ictu-logo.png" alt="Logo ICTU" /><div className="brand-copy"><strong className="brand-name">KTX ICTU</strong><span className="brand-subtitle">Quản lý ký túc xá</span></div></div><nav className="sidebar-nav"><div className="nav-section-label">{isStudent ? 'Cổng sinh viên' : 'Vận hành'}</div><ul className="nav-list">{navigation.map(({ label, href, icon: Icon, badge }) => <li key={href}><NavLink to={href} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end={href === '/' || href === '/student'} aria-label={label}>{({ isActive }) => <><Icon className="nav-icon" size={18} strokeWidth={isActive ? 2.4 : 1.9} aria-hidden="true" /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</>}</NavLink></li>)}</ul>{!isStudent && <><div className="nav-section-label">Hệ thống</div><ul className="nav-list"><li><NavLink to="/reports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><BarChart3 className="nav-icon" size={18} aria-hidden="true" /><span>Báo cáo</span></NavLink></li><li><a className="nav-link" href="#settings"><Settings className="nav-icon" size={18} aria-hidden="true" /><span>Cài đặt</span></a></li></ul></>}</nav><div className="sidebar-footer"><button className="help-card" type="button" onClick={onHelpClick}><strong><LifeBuoy size={16} /> Cần hỗ trợ?</strong><span>Gửi yêu cầu cho đội vận hành khi gặp vấn đề.</span></button><BedDouble size={18} color="#77d9cc" aria-hidden="true" /></div></aside>
}
