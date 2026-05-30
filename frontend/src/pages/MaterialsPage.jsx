import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiDownload, FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { materialsService, suppliersService } from '../services/api'

const initialMaterial = { materialName: '', category: '', quantity: 0, unitPrice: 0, supplier: { supplierId: '' }, stockStatus: 'In stock' }

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState(initialMaterial)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [alert, setAlert] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [materialsRes, suppliersRes] = await Promise.all([
        materialsService.getAll(),
        suppliersService.getAll()
      ])
      setMaterials(materialsRes.data || [])
      setSuppliers(suppliersRes.data || [])
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to load materials and suppliers')
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
        ...form,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        supplierId: form.supplier?.supplierId || null
      }

      if (editId) {
        await materialsService.update(editId, payload)
        setAlert('Material updated successfully')
      } else {
        await materialsService.create(payload)
        setAlert('Material added successfully')
      }

      setForm(initialMaterial)
      setEditId(null)
      loadData()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to save material')
    }
  }

  const handleEdit = (item) => {
    setEditId(item.materialId)
    setForm({
      materialName: item.materialName,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      supplier: { supplierId: item.supplier?.supplierId ?? '' },
      stockStatus: item.stockStatus
    })
  }

  const handleDelete = async (id) => {
    setError('')
    setAlert('')

    try {
      await materialsService.remove(id)
      setAlert('Material deleted')
      loadData()
    } catch (err) {
      setError(err.message || err?.data?.message || 'Unable to delete material')
    }
  }

  const filtered = materials.filter(item =>
    item.materialName.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.supplier?.supplierName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Material Operations</span>
          <h2>Materials Master Data</h2>
          <p>Enterprise-grade material catalog with QR tracking, supplier assignment, and stock status.</p>
        </div>
      </div>

      {loading && <div className="alert info">Loading materials...</div>}
      {error && <div className="alert danger">{error}</div>}
      {alert && <div className="alert success">{alert}</div>}

      <section className="toolbar-panel">
        <div className="toolbar-left">
          <button className="button outline"><FiUpload /> Bulk Upload</button>
          <button className="button outline"><FiDownload /> Export Excel</button>
        </div>
        <div className="toolbar-right">
          <div className="search-input">
            <FiSearch />
            <input type="search" placeholder="Search materials, categories or suppliers" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="button primary"><FiPlus /> Add Material</button>
        </div>
      </section>

      <section className="form-section">
        <motion.form onSubmit={handleSubmit} className="form-grid" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <label className="input-group">
            <span>Material Name</span>
            <input value={form.materialName} onChange={e => setForm({ ...form, materialName: e.target.value })} required />
          </label>
          <label className="input-group">
            <span>Category</span>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </label>
          <label className="input-group">
            <span>Quantity</span>
            <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} min="0" />
          </label>
          <label className="input-group">
            <span>Unit Price</span>
            <input type="number" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: Number(e.target.value) })} min="0" step="0.01" />
          </label>
          <label className="input-group">
            <span>Supplier</span>
            <select value={form.supplier.supplierId} onChange={e => setForm({ ...form, supplier: { supplierId: Number(e.target.value) } })}>
              <option value="">Choose supplier</option>
              {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>)}
            </select>
          </label>
          <label className="input-group">
            <span>Stock Status</span>
            <select value={form.stockStatus} onChange={e => setForm({ ...form, stockStatus: e.target.value })}>
              <option>In stock</option>
              <option>Low stock</option>
              <option>Out of stock</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" className="button primary">{editId ? 'Update Material' : 'Save Material'}</button>
          </div>
        </motion.form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h3>Material Catalog</h3>
          <span>{filtered.length} records found</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Quantity</th><th>Unit Price</th><th>Supplier</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.materialId}>
                  <td>{item.materialName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.supplier?.supplierName || 'N/A'}</td>
                  <td><span className={`badge ${item.stockStatus === 'Low stock' ? 'warning' : item.stockStatus === 'Out of stock' ? 'danger' : 'success'}`}>{item.stockStatus}</span></td>
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
