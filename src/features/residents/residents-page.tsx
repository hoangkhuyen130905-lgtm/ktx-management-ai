import { useEffect, useMemo, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { DataTable } from '../../components/data-table/data-table'
import { PageHeader } from '../../components/layout/page-header'
import { Button } from '../../components/ui/button'
import { Dialog, DialogActions } from '../../components/ui/dialog'
import { FormField } from '../../components/ui/form-field'
import { StatusBadge } from '../../components/ui/status-badge'
import { repository } from '../../data/mock/mock-repository'
import type { Resident, ResidentInput } from '../../lib/types'
import { formatDate } from '../../lib/utils'

const emptyForm: ResidentInput = { studentCode: '', fullName: '', gender: 'Nam', phone: '', email: '', roomId: 'room-a101', building: 'Tòa A', status: 'pending' }

export function ResidentsPage() {
  const [items, setItems] = useState<Resident[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ResidentInput>(emptyForm)
  const [error, setError] = useState('')
  useEffect(() => { repository.listResidents().then(setItems) }, [])
  const filtered = useMemo(() => items.filter((resident) => `${resident.fullName} ${resident.studentCode} ${resident.roomId}`.toLowerCase().includes(query.toLowerCase())), [items, query])
  const update = (key: keyof ResidentInput, value: string) => setForm((current) => ({ ...current, [key]: value }))
  async function submit() { if (!form.studentCode || !form.fullName || !form.phone) { setError('Vui lòng nhập đủ mã sinh viên, họ tên và số điện thoại.'); return } const resident = await repository.createResident(form); setItems((current) => [resident, ...current]); setForm(emptyForm); setError(''); setOpen(false) }
  return <><PageHeader title="Quản lý sinh viên" description="Theo dõi hồ sơ, phòng ở và trạng thái cư trú của sinh viên." actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Thêm sinh viên</Button>} /><div className="card" style={{ marginBottom: 20 }}><div className="card-content" style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="kpi-icon primary"><Users size={18} /></span><div><strong>{items.length} sinh viên</strong><p className="card-description">Dữ liệu mock sẵn sàng thay bằng API.</p></div></div></div><DataTable columns={[{ key: 'student', header: 'Sinh viên', render: (row) => <div><div className="cell-primary">{row.fullName}</div><div className="cell-secondary">{row.studentCode}</div></div> }, { key: 'room', header: 'Phòng', render: (row) => <span>{row.building} · {row.roomId.replace('room-', '').toUpperCase()}</span> }, { key: 'phone', header: 'Liên hệ', render: (row) => <div><div>{row.phone}</div><div className="cell-secondary">{row.email}</div></div> }, { key: 'checkIn', header: 'Ngày nhận phòng', render: (row) => formatDate(row.checkInDate) }, { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> }]} data={filtered} rowKey={(row) => row.id} search={query} onSearch={setQuery} totalLabel={`${filtered.length}/${items.length} sinh viên`} emptyMessage="Không tìm thấy sinh viên." /><Dialog open={open} title="Thêm sinh viên" description="Tạo hồ sơ cư trú mới. Các trường có dấu * là bắt buộc." onClose={() => { setOpen(false); setError('') }} footer={<DialogActions onCancel={() => setOpen(false)} onSubmit={submit} submitLabel="Tạo hồ sơ" /> }><div className="form-grid"><FormField label="Mã sinh viên" required value={form.studentCode} onChange={(event) => update('studentCode', event.target.value)} placeholder="B23DCCN001" /><FormField label="Họ và tên" required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Nguyễn Văn A" /><FormField label="Số điện thoại" required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="0901 234 567" /><FormField label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="sinhvien@svictu.edu.vn" /><div className="form-field"><label className="form-label" htmlFor="gender">Giới tính</label><select id="gender" className="form-input" value={form.gender} onChange={(event) => update('gender', event.target.value)}><option>Nam</option><option>Nữ</option><option>Khác</option></select></div><div className="form-field"><label className="form-label" htmlFor="building">Tòa nhà</label><select id="building" className="form-input" value={form.building} onChange={(event) => update('building', event.target.value)}><option>Tòa A</option><option>Tòa B</option><option>Tòa C</option></select></div><div className="form-field full"><label className="form-label" htmlFor="room">Phòng đăng ký</label><select id="room" className="form-input" value={form.roomId} onChange={(event) => update('roomId', event.target.value)}><option value="room-a101">A101 · Tòa A</option><option value="room-a201">A201 · Tòa A</option><option value="room-b102">B102 · Tòa B</option><option value="room-c101">C101 · Tòa C</option></select></div></div>{error && <p className="form-error" role="alert">{error}</p>}</Dialog></>
}
