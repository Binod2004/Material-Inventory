import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MaterialsPage from './pages/MaterialsPage'
import SuppliersPage from './pages/SuppliersPage'
import StockPage from './pages/StockPage'
import ReportsPage from './pages/ReportsPage'
import NotFoundPage from './pages/NotFoundPage'
import { authService } from './services/api'

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const loggedIn = authService.isAuthenticated()

  return (
    <BrowserRouter>
      <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {loggedIn && <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(prev => !prev)} />}
        <div className="content-area">
          {loggedIn && <Header collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} />}
          <Routes>
            <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/materials" element={<PrivateRoute><MaterialsPage /></PrivateRoute>} />
            <Route path="/suppliers" element={<PrivateRoute><SuppliersPage /></PrivateRoute>} />
            <Route path="/stock" element={<PrivateRoute><StockPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {loggedIn && <Footer />}
        </div>
      </div>
    </BrowserRouter>
  )
}
