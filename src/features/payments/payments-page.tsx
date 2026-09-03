import { useEffect, useMemo, useState } from 'react'
import { BellRing, CheckCircle2, CircleDollarSign } from 'lucide-react'
import { PageHeader } from '../../components/layout/page-header'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/status-badge'
import { repository } from '../../data/mock/mock-repository'
import type { Payment } from '../../lib/types'
import { formatCurrency, formatDate } from '../../lib/utils'

export function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]); const [query, setQuery] = useState(''); const [status, setStatus] = useState('all')
  useEffect(() => { repository.listPayments().then(setItems) }, [])
  const filtered = useMemo(() => items.filter((item) => (status === 'all' || item.status === status) && `${item.residentName} ${item.roomCode} ${item.invoiceCode}`.toLowerCase().includes(query.toLowerCase())), [items, query, status])
  async function record(item: Payment) { const updated = await repository.recordPayment(item.id, `TXN-${Math.floor(Math.random() * 9000 + 1000)}`); setItems((current) => current.map((row) => row.id === item.id ? updated : row)) }
  async function remind(item: Payment) { await repository.sendPaymentReminder(item.id) }
  const total = items.reduce((sum, item) => sum + item.amount, 0); const collected = items.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
  return <><PageHeader title="Hóa đơn & thu phí" description="Theo dõi hóa đơn, công nợ và ghi nhận thanh toán." actions={<Button><CircleDollarSign size={16} /> Tạo hóa đơn</Button>} /><div className="kpi-grid compact-kpis"><Summary label="Tổng phải thu" value={formatCurrency(total)} /><Summary label="Đã thu" value={formatCurrency(collected)} tone="success" /><Summary label="Chờ thu" value={formatCurrency(total - collected)} tone="warning" /><Summary label="Quá hạn" value={items.filter((item) => item.status === 'overdue').length} tone="danger" /></div><div className="card"><div className="table-toolbar"><div className="toolbar-controls"><input className="field-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hóa đơn, sinh viên..." aria-label="Tìm hóa đơn" /><select className="select-control" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Lọc trạng thái thanh toán"><option value="all">Tất cả trạng thái</option><option value="paid">Đã thanh toán</option><option value="due">Chờ thanh toán</option><option value="overdue">Quá hạn</option></select></div><span className="table-count">{filtered.length} hóa đơn</span></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Mã hóa đơn</th><th>Sinh viên</th><th>Kỳ</th><th>Hạn thanh toán</th><th>Số tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td className="cell-primary">{item.invoiceCode}</td><td><div>{item.residentName}</div><div className="cell-secondary">Phòng {item.roomCode}</div></td><td>{item.period}</td><td>{formatDate(item.dueDate)}</td><td className="cell-primary">{formatCurrency(item.amount)}</td><td><StatusBadge status={item.status} /></td><td><div className="action-group">{item.status !== 'paid' && <><Button size="sm" onClick={() => record(item)}><CheckCircle2 size={14} /> Ghi thu</Button><Button size="sm" variant="secondary" onClick={() => remind(item)}><BellRing size={14} /></Button></>}</div></td></tr>)}</tbody></table></div></div></>
}
function Summary({ label, value, tone = 'primary' }: { label: string; value: string | number; tone?: string }) { return <Card><CardContent className="summary-card"><span className={`kpi-icon ${tone}`}><CircleDollarSign size={18} /></span><div><span className="kpi-label">{label}</span><strong className="summary-value summary-money">{value}</strong></div></CardContent></Card> }
