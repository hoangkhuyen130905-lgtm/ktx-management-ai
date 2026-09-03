import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, LogIn, ShieldCheck, Sparkles } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { FormField } from '../../components/ui/form-field'
import { useAuth } from '../../context/auth-context'

export function LoginPage() {
  const { currentUser, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  if (currentUser) return <Navigate to={currentUser.role === 'student' ? '/student' : '/'} replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const success = await login(username, password)
    setLoading(false)
    if (!success) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
      return
    }
    const from = new URLSearchParams(location.search).get('from')
    navigate(from && from.startsWith('/') ? from : username === 'student' ? '/student' : '/', { replace: true })
  }

  return <main className="auth-page"><section className="auth-shell"><aside className="auth-visual"><div className="auth-visual-top"><img className="auth-logo" src="/ictu-logo.png" alt="Logo ICTU" /><span className="auth-logo-name">KTX ICTU</span><span className="auth-live"><i /> HỆ THỐNG TRỰC TUYẾN</span></div><div className="auth-visual-content"><span className="auth-kicker"><Sparkles size={14} /> Không gian vận hành thông minh</span><h1>Mọi việc trong tầm mắt.<br /><em>Mỗi ngày nhẹ hơn.</em></h1><p>Một nền tảng thống nhất cho phòng ở, sinh viên, hợp đồng và những quyết định nhanh hơn.</p><div className="auth-feature-list"><div><CheckCircle2 size={17} /><span>Quản lý tập trung, rõ ràng</span></div><div><CheckCircle2 size={17} /><span>Trợ lý AI read-only an toàn</span></div><div><CheckCircle2 size={17} /><span>Dữ liệu vận hành theo thời gian thực</span></div></div></div><div className="auth-visual-footer"><span>ICTU · CAMPUS OPERATIONS</span><span>2026</span></div><div className="auth-orb auth-orb-one" /><div className="auth-orb auth-orb-two" /></aside><section className="auth-panel"><div className="auth-panel-heading"><span className="auth-panel-eyebrow">CỔNG TRUY CẬP</span><h2>Chào mừng trở lại</h2><p>Đăng nhập để tiếp tục vào không gian làm việc của bạn.</p></div><form className="auth-form" onSubmit={submit}><FormField label="Tên đăng nhập" required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Nhập tên đăng nhập" /><FormField label="Mật khẩu" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Nhập mật khẩu" />{error && <p className="form-error auth-error" role="alert">{error}</p>}<Button type="submit" disabled={loading}>{loading ? 'Đang xác thực...' : 'Đăng nhập'}<LogIn size={16} /></Button></form><div className="demo-accounts"><div className="demo-title"><ShieldCheck size={16} /> Chọn nhanh tài khoản</div><button type="button" onClick={() => { setUsername('admin'); setPassword('admin123') }}><span className="demo-account-icon admin">A</span><span className="demo-account-copy"><strong>Quản trị viên</strong><small>Toàn quyền vận hành hệ thống</small></span><ArrowRight size={16} /></button><button type="button" onClick={() => { setUsername('student'); setPassword('student123') }}><span className="demo-account-icon student">S</span><span className="demo-account-copy"><strong>Sinh viên</strong><small>Cổng thông tin cá nhân</small></span><ArrowRight size={16} /></button></div><div className="auth-security"><LockKeyhole size={14} /><span>Phiên đăng nhập được lưu an toàn trên thiết bị này.</span></div></section></section></main>
}
