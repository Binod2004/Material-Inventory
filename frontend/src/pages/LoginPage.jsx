import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiUser, FiChevronRight } from 'react-icons/fi'
import { authService } from '../services/api'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login({ username, password })
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-header">
          <div>
            <span className="eyebrow">Enterprise Access</span>
            <h1>Vizag Steel Plant Login</h1>
            <p>Secure access for plant operations, material planning and inventory control.</p>
          </div>
          <div className="auth-badge">Industrial PMS</div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <label className="input-group">
            <span>Username</span>
            <div className="input-with-icon">
              <FiUser />
              <input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          </label>
          <label className="input-group">
            <span>Password</span>
            <div className="input-with-icon">
              <FiLock />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </label>
          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <FiChevronRight />
          </button>
          {error && <div className="alert error">{error}</div>}
        </form>
      </motion.div>
    </div>
  )
}
