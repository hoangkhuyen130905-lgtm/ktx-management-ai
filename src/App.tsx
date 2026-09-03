import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/app-shell'
import { RequireAuth, RequireRole, PublicOnly } from './components/auth/route-guard'
import { AuthProvider } from './context/auth-context'
import { DashboardPage } from './features/dashboard/dashboard-page'
import { ResidentsPage } from './features/residents/residents-page'
import { RoomsPage } from './features/rooms/rooms-page'
import { ApplicationsPage } from './features/applications/applications-page'
import { ContractsPage } from './features/contracts/contracts-page'
import { PaymentsPage } from './features/payments/payments-page'
import { MaintenancePage } from './features/maintenance/maintenance-page'
import { LoginPage } from './features/auth/login-page'
import { StudentHomePage } from './features/student/student-home-page'
import { ReportsPage } from './features/reports/reports-page'

export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route element={<PublicOnly />}><Route path="/login" element={<LoginPage />} /></Route><Route element={<RequireAuth />}><Route element={<AppShell />}><Route element={<RequireRole role="admin" />}><Route path="/" element={<DashboardPage />} /><Route path="/residents" element={<ResidentsPage />} /><Route path="/rooms" element={<RoomsPage />} /><Route path="/applications" element={<ApplicationsPage />} /><Route path="/contracts" element={<ContractsPage />} /><Route path="/payments" element={<PaymentsPage />} /><Route path="/maintenance" element={<MaintenancePage />} /><Route path="/reports" element={<ReportsPage />} /></Route><Route element={<RequireRole role="student" />}><Route path="/student" element={<StudentHomePage />} /></Route></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter></AuthProvider>
}
