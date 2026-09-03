export type ResidentStatus = 'active' | 'pending' | 'checked_out'
export type RoomStatus = 'available' | 'occupied' | 'full' | 'maintenance'
export type PaymentStatus = 'paid' | 'due' | 'overdue'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'
export type ContractStatus = 'draft' | 'active' | 'expiring' | 'expired'
export type MaintenanceStatus = 'new' | 'in_progress' | 'closed'
export type MaintenancePriority = 'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp'
export type Role = 'admin' | 'student'
export type NotificationAudience = Role | 'all'

export type AuthUser = {
  id: string
  username: string
  displayName: string
  role: Role
  studentCode?: string
  residentId?: string
  gender?: 'Nam' | 'Nữ'
}

export type Session = {
  version: 1
  user: AuthUser
}

export type Resident = {
  id: string
  studentCode: string
  fullName: string
  gender: 'Nam' | 'Nữ' | 'Khác'
  phone: string
  email: string
  roomId: string
  bedNumber?: number
  building: string
  checkInDate: string
  status: ResidentStatus
}

export type Room = {
  id: string
  code: string
  building: string
  floor: number
  capacity: number
  occupied: number
  gender: 'Nam' | 'Nữ'
  status: RoomStatus
}

export type Payment = {
  id: string
  invoiceCode: string
  residentId: string
  residentName: string
  roomCode: string
  period: string
  amount: number
  dueDate: string
  paidAt?: string
  transactionCode?: string
  status: PaymentStatus
}

export type HousingApplication = {
  id: string
  applicationCode: string
  studentCode: string
  studentName: string
  gender: 'Nam' | 'Nữ'
  preferredBuilding: string
  preferredRoomType: string
  submittedAt: string
  expectedMoveIn: string
  status: ApplicationStatus
  note?: string
}

export type Contract = {
  id: string
  contractCode: string
  residentId: string
  residentName: string
  roomCode: string
  building: string
  startDate: string
  endDate: string
  monthlyFee: number
  status: ContractStatus
}

export type MaintenanceTicket = {
  id: string
  title: string
  description: string
  location: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  assignee?: string
  createdAt: string
  updatedAt: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: 'application' | 'payment' | 'maintenance' | 'contract' | 'support'
  href?: string
  createdAt: string
  read: boolean
}

export type HelpRequest = {
  id: string
  category: 'Cơ sở vật chất' | 'Tài khoản' | 'Hóa đơn' | 'Khác'
  subject: string
  description: string
  priority: MaintenancePriority
  status: 'new' | 'in_progress' | 'closed'
  createdAt: string
}

export type DashboardSummary = {
  occupancyRate: number
  occupiedBeds: number
  totalBeds: number
  availableBeds: number
  overdueAmount: number
  openTickets: number
  residentsThisMonth: number
}

export type ResidentInput = Omit<Resident, 'id' | 'checkInDate'> & { checkInDate?: string }
export type Paginated<T> = { data: T[]; total: number }

export type ReportFilters = { month: string; building: 'all' | string }
export type ReportBuilding = { building: string; occupied: number; capacity: number; available: number; occupancyRate: number }
export type ReportStatusCount = { status: string; count: number }
export type ReportData = { filters: ReportFilters; totalBeds: number; occupiedBeds: number; availableBeds: number; occupancyRate: number; totalBilled: number; collectedAmount: number; overdueAmount: number; buildings: ReportBuilding[]; applications: ReportStatusCount[]; contracts: ReportStatusCount[]; tickets: ReportStatusCount[]; overduePayments: Payment[] }
