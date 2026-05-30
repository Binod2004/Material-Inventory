import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi'
import { authService } from '../services/api'

const labels = {
  '/dashboard': 'Executive Dashboard',
  '/materials': 'Materials Management',
  '/suppliers': 'Supplier Operations',
  '/stock': 'Inventory Control',
  '/reports': 'Analytics & Reports'
}

export default function Header({ collapsed, onToggleSidebar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const title = labels[location.pathname] || 'Enterprise Control Panel'

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <header className="header-bar">
      <div className="header-left">
        <button className="icon-button menu-button" type="button" onClick={onToggleSidebar} aria-label="Open sidebar">
          <FiMenu />
        </button>
        <div className="header-copy">
          <span className="header-subtitle">Vizag Steel Enterprise PMS</span>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="header-actions">
        <button type="button" className="icon-button notification-button" aria-label="Notifications">
          <FiBell />
          <span className="notification-count">5</span>
        </button>
        <button type="button" className="btn-secondary" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  )
}
