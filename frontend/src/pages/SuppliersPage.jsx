import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiStar, FiShield, FiPhone, FiMail, FiMapPin, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { suppliersService } from '../services/api'

const initialSupplier = { supplierName: '', phone: '', email: '', address: '', rating: 4.7, status: 'Active' }

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState(initialSupplier)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [alert, setAlert] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadSuppliers = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await suppliersService.getAll()
      setSuppliers(res.data || [])
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSuppliers() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setAlert('')

    try {
      if (editId) {
        await suppliersService.update(editId, form)
        setAlert('Supplier updated successfully')
      } else {
        await suppliersService.create(form)
        setAlert('Supplier added successfully')
      }
      setForm(initialSupplier)
      setEditId(null)
      loadSuppliers()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to save supplier')
    }
  }

  const handleEdit = (supplier) => {
    setEditId(supplier.supplierId)
    setForm({
      supplierName: supplier.supplierName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      rating: supplier.rating ?? 4.7,
      status: supplier.status ?? 'Active'
    })
  }

  const handleDelete = async (id) => {
    setError('')
    setAlert('')

    try {
      await suppliersService.remove(id)
      setAlert('Supplier deleted successfully')
      loadSuppliers()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to delete supplier')
    }
  }

  const filtered = suppliers.filter(item =>
    item.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase()) ||
    item.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Supplier Network</span>
          <h2>Strategic Supplier Intelligence</h2>
          <p>Track supplier performance, contact details, and contract status in one enterprise view.</p>
        </div>
      </div>

      {loading && <div className="alert info">Loading suppliers...</div>}
      {error && <div className="alert danger">{error}</div>}
      {alert && <div className="alert success">{alert}</div>}

      <section className="toolbar-panel">
        <div className="toolbar-left">
          <button className="button outline"><FiPlus /> New Supplier</button>
          <button className="button outline"><FiDownload /> Export CSV</button>
        </div>
        <div className="toolbar-right">
          <div className="search-input">
            <FiSearch />
            <input type="search" placeholder="Search supplier name, email or city" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="form-section supplier-form">
        <motion.form onSubmit={handleSubmit} className="form-grid" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <label className="input-group">
            <span>Supplier Name</span>
            <input value={form.supplierName} onChange={e => setForm({ ...form, supplierName: e.target.value })} required />
          </label>
          <label className="input-group">
            <span>Phone</span>
            <div className="input-with-icon"><FiPhone /><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          </label>
          <label className="input-group">
            <span>Email</span>
            <div className="input-with-icon"><FiMail /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          </label>
          <label className="input-group">
            <span>Address</span>
            <div className="input-with-icon"><FiMapPin /><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          </label>
          <label className="input-group">
            <span>Supplier Rating</span>
            <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
          </label>
          <label className="input-group">
            <span>Status</span>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Pending</option>
              <option>Blacklisted</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" className="button primary">{editId ? 'Update Supplier' : 'Save Supplier'}</button>
          </div>
        </motion.form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h3>Supplier Directory</h3>
          <span>{filtered.length} records</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Email</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.supplierId}>
                  <td>{item.supplierName}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td><span className="badge badge-info">{item.rating ?? 0}</span></td>
                  <td><span className={`badge ${item.status === 'Active' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}`}>{item.status}</span></td>
                  <td className="row-actions">
                    <button className="button outline"><FiEdit2 /></button>
                    <button className="button danger"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
