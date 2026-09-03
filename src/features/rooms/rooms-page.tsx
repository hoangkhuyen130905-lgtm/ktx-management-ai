import { useEffect, useMemo, useState } from 'react'
import { Building2, Mail, Phone } from 'lucide-react'
import { Dialog } from '../../components/ui/dialog'
import { PageHeader } from '../../components/layout/page-header'
import { StatusBadge } from '../../components/ui/status-badge'
import { repository } from '../../data/mock/mock-repository'
import { rooms } from '../../data/mock/fixtures'
import type { Resident, Room } from '../../lib/types'
import { formatDate } from '../../lib/utils'

function RoomDetails({ room, residents, onClose }: { room: Room; residents: Resident[]; onClose: () => void }) {
  const currentResidents = residents.filter((resident) => resident.roomId === room.id && resident.status !== 'checked_out')
  const roomSlots = Array.from({ length: room.capacity }, (_, index) => {
    const number = index + 1
    const resident = currentResidents.find((item) => item.bedNumber === number)
    const unavailable = room.status === 'maintenance'
    const occupied = index < room.occupied
    return { number, resident, unavailable, occupied }
  })

  return <Dialog open title={`Chi tiết phòng ${room.code}`} description={`${room.building} · Tầng ${room.floor} · Khu ${room.gender}`} onClose={onClose}>
    <div className="room-detail-summary">
      <div><span className="detail-label">Trạng thái</span><StatusBadge status={room.status} /></div>
      <div><span className="detail-label">Sức chứa</span><strong>{room.occupied}/{room.capacity} người</strong></div>
      <div><span className="detail-label">Còn trống</span><strong>{Math.max(room.capacity - room.occupied, 0)} giường</strong></div>
    </div>

    <section className="room-detail-section" aria-labelledby="bed-layout-title">
      <div className="room-detail-section-head"><div><h3 id="bed-layout-title">Sơ đồ giường</h3><p>Giường đang dùng, còn trống và chưa có hồ sơ cư trú.</p></div><span className="room-detail-count">{currentResidents.length} người có hồ sơ</span></div>
      <div className="bed-grid">{roomSlots.map((slot) => <div className={`bed-slot ${slot.unavailable ? 'unavailable' : slot.resident ? 'occupied' : slot.occupied ? 'missing' : 'available'}`} key={slot.number}>
        <div className="bed-slot-head"><strong>Giường {slot.number}</strong><span>{slot.unavailable ? 'Không sử dụng' : slot.resident ? 'Đang ở' : slot.occupied ? 'Đã dùng' : 'Còn trống'}</span></div>
        {slot.resident ? <><div className="bed-resident-name">{slot.resident.fullName}</div><div className="bed-resident-code">{slot.resident.studentCode}</div></> : <span className="bed-slot-note">{slot.unavailable ? 'Phòng đang bảo trì' : slot.occupied ? 'Chưa có hồ sơ người ở' : 'Sẵn sàng tiếp nhận'}</span>}
      </div>)}</div>
    </section>

    <section className="room-detail-section" aria-labelledby="resident-list-title">
      <div className="room-detail-section-head"><div><h3 id="resident-list-title">Người đang ở</h3><p>Thông tin cư trú và liên hệ trong phòng.</p></div></div>
      {currentResidents.length ? <div className="resident-detail-list">{currentResidents.map((resident) => <article className="resident-detail-card" key={resident.id}>
        <div className="resident-detail-head"><div><strong>{resident.fullName}</strong><span>{resident.studentCode} · Giường {resident.bedNumber ?? 'chưa phân'}</span></div><StatusBadge status={resident.status} /></div>
        <div className="resident-detail-contact"><span><Phone size={14} />{resident.phone}</span><span><Mail size={14} />{resident.email}</span><span>Nhận phòng {formatDate(resident.checkInDate)}</span></div>
      </article>)}</div> : <div className="empty-state room-detail-empty">Chưa có hồ sơ người đang ở phòng này.</div>}
    </section>
  </Dialog>
}

export function RoomsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [building, setBuilding] = useState('all')
  useEffect(() => { void repository.listResidents().then(setResidents) }, [])
  const filteredRooms = useMemo(() => rooms.filter((room) => building === 'all' || room.building === building), [building])

  return <><PageHeader title="Tòa nhà & phòng" description="Theo dõi công suất, trạng thái và sức chứa từng phòng." actions={<select className="select-control" aria-label="Lọc theo tòa nhà" value={building} onChange={(event) => setBuilding(event.target.value)}><option value="all">Tất cả tòa nhà</option><option value="Tòa A">Tòa A</option><option value="Tòa B">Tòa B</option><option value="Tòa C">Tòa C</option></select>} /><div className="room-grid">{filteredRooms.map((room) => <article className="room-card" key={room.id}><div className="room-card-head"><div><div className="room-code">{room.code}</div><div className="room-meta"><Building2 size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{room.building} · Tầng {room.floor} · {room.gender}</div></div><StatusBadge status={room.status} /></div><div className="room-capacity"><span>Sức chứa</span><strong>{room.occupied}/{room.capacity} người</strong></div><div className="progress"><div className={`progress-bar ${room.status === 'full' ? 'danger' : room.status === 'maintenance' ? 'warning' : ''}`} style={{ width: `${(room.occupied / room.capacity) * 100}%` }} /></div><button className="btn btn-secondary btn-sm" type="button" onClick={() => setSelectedRoom(room)}>Xem chi tiết</button></article>)}</div>{selectedRoom && <RoomDetails room={selectedRoom} residents={residents} onClose={() => setSelectedRoom(null)} />}</>
}
