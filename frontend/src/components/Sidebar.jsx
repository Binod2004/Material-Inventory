import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiBox, FiTruck, FiArchive, FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight, FiBell, FiUser } from 'react-icons/fi'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
  { label: 'Materials', path: '/materials', icon: <FiBox /> },
  { label: 'Suppliers', path: '/suppliers', icon: <FiUser /> },
  { label: 'Inventory', path: '/stock', icon: <FiTruck /> },
  { label: 'Reports', path: '/reports', icon: <FiBarChart2 /> }
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="brand-mark">VS</div>
          {!collapsed && (
            <div className="brand-text">
              <span>Vizag Steel</span>
              <strong>Enterprise PMS</strong>
            </div>
          )}
        </div>
        <button type="button" className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {!collapsed && (
        <div className="profile-card">
          <div className="profile-avatar">VS</div>
          <div className="profile-meta">
            <span>Plant Manager</span>
            <small>Vizag Steel, India</small>
          </div>
          <div className="notification-pill">
            <FiBell />
            <span>3</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className="sidebar-link">
            <span className="link-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <span>Industrial ERP</span>
          <small>Smart factory dashboard</small>
        </div>
      )}
    </aside>
  )
}
