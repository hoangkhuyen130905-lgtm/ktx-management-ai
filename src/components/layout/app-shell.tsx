import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { Button } from '../ui/button'
import { HelpRequestDialog } from '../help/help-request-dialog'
import { AppProvider } from '../../context/app-context'

export function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  return <AppProvider><div className="app-shell"><Sidebar onHelpClick={() => setHelpOpen(true)} />{mobileMenuOpen && <div className="mobile-sidebar-overlay" role="presentation" onClick={() => setMobileMenuOpen(false)}><div className="mobile-sidebar" onClick={(event) => event.stopPropagation()}><Sidebar onHelpClick={() => { setHelpOpen(true); setMobileMenuOpen(false) }} /><Button variant="secondary" size="sm" onClick={() => setMobileMenuOpen(false)}>Đóng menu</Button></div></div>}<div className="main-frame"><Topbar onMenuClick={() => setMobileMenuOpen(true)} /><main className="main-content"><Outlet /></main></div><HelpRequestDialog open={helpOpen} onClose={() => setHelpOpen(false)} /></div></AppProvider>
}
