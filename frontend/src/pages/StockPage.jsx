import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiRotateCcw, FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { stockService, materialsService } from '../services/api'

const initialStock = { material: { materialId: '' }, availableStock: 0, minimumStock: 0 }

export default function StockPage() {
  const [stock, setStock] = useState([])
  const [materials, setMaterials] = useState([])
  const [form, setForm] = useState(initialStock)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [alert, setAlert] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [stockRes, materialsRes] = await Promise.all([
        stockService.getAll(),
        materialsService.getAll()
      ])
      setStock(stockRes.data || [])
      setMaterials(materialsRes.data || [])
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to load stock data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setAlert('')

    try {
      const payload = {
        materialId: form.material.materialId,
        availableStock: Number(form.availableStock),
        minimumStock: Number(form.minimumStock)
      }

      if (editId) {
        await stockService.update(editId, payload)
        setAlert('Stock updated successfully')
      } else {
        await stockService.create(payload)
        setAlert('Stock level added successfully')
      }

      setEditId(null)
      setForm(initialStock)
      loadData()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to save stock')
    }
  }

  const handleEdit = (item) => {
    setEditId(item.stockId)
    setForm({ material: { materialId: item.material.materialId }, availableStock: item.availableStock, minimumStock: item.minimumStock })
  }

  const handleDelete = async (id) => {
    setError('')
    setAlert('')

    try {
      await stockService.remove(id)
      setAlert('Stock record deleted')
      loadData()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to delete stock record')
    }
  }

  const filtered = stock.filter(item =>
    item.material?.materialName?.toLowerCase().includes(search.toLowerCase()) ||
    item.material?.category?.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockCount = stock.filter(item => item.availableStock < item.minimumStock).length

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Inventory Control</span>
          <h2>Stock Operations Hub</h2>
          <p>Track stock balance, alerts, and warehouse movements in a single command center.</p>
        </div>
      </div>

      {loading && <div className="alert info">Loading stock...</div>}
      {error && <div className="alert danger">{error}</div>}
      {alert && <div className="alert success">{alert}</div>}
      {lowStockCount > 0 && (
        <div className="alert warning">
          <strong>Attention:</strong> {lowStockCount} material{lowStockCount === 1 ? '' : 's'} below safety stock.
        </div>
      )}

      <section className="toolbar-panel">
        <div className="toolbar-left">
          <button className="button outline"><FiPlus /> Receive Material</button>
          <button className="button outline"><FiRotateCcw /> Transfer Stock</button>
        </div>
        <div className="toolbar-right">
          <div className="search-input">
            <FiSearch />
            <input type="search" placeholder="Search material or warehouse" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="form-section stock-form">
        <motion.form onSubmit={handleSubmit} className="form-grid" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <label className="input-group">
            <span>Material</span>
            <select value={form.material.materialId} onChange={e => setForm({ ...form, material: { materialId: Number(e.target.value) } })} required>
              <option value="">Select material</option>
              {materials.map(m => <option key={m.materialId} value={m.materialId}>{m.materialName}</option>)}
            </select>
          </label>
          <label className="input-group">
            <span>Available Stock</span>
            <input type="number" value={form.availableStock} onChange={e => setForm({ ...form, availableStock: Number(e.target.value) })} min="0" required />
          </label>
          <label className="input-group">
            <span>Minimum Stock</span>
            <input type="number" value={form.minimumStock} onChange={e => setForm({ ...form, minimumStock: Number(e.target.value) })} min="0" required />
          </label>
          <div className="form-actions">
            <button type="submit" className="button primary">{editId ? 'Update Stock' : 'Save Stock'}</button>
          </div>
        </motion.form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h3>Stock Ledger</h3>
          <span>{filtered.length} material entries</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Material</th><th>Available</th><th>Minimum</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const status = item.availableStock <= 0 ? 'Out of stock' : item.availableStock < item.minimumStock ? 'Critical' : 'Normal'
                return (
                  <tr key={item.stockId}>
                    <td>{item.material?.materialName}</td>
                    <td>{item.availableStock}</td>
                    <td>{item.minimumStock}</td>
                    <td><span className={`badge ${status === 'Normal' ? 'success' : status === 'Critical' ? 'warning' : 'danger'}`}>{status}</span></td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td className="row-actions">
                      <button className="button outline"><FiEdit2 /></button>
                      <button className="button danger"><FiTrash2 /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
