import React, { useState } from 'react'
import api from '../services/api'

export default function AdminPage({ materials, suppliers, onRefresh }) {
  const [material, setMaterial] = useState({ code: '', name: '', unit: '', min_level: '' })
  const [supplier, setSupplier] = useState({ name: '', contact: '' })
  const [stock, setStock] = useState({ material_id: '', supplier_id: '', quantity: '', min_level: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (event, endpoint, payload, successText) => {
    event.preventDefault()
    try {
      await api.post(endpoint, payload)
      setMessage(successText)
      onRefresh()
    } catch (error) {
      setMessage(error.response?.data?.error || 'Save failed')
    }
  }

  return (
    <div className="admin-page">
      <h2>Admin Console</h2>
      <p className="hint">Use this page to add materials, suppliers, and update stock levels.</p>
      {message && <div className="message">{message}</div>}

      <div className="admin-grid">
        <section>
          <h3>Add Material</h3>
          <form onSubmit={e => handleSubmit(e, '/materials', {
            code: material.code,
            name: material.name,
            unit: material.unit,
            min_level: Number(material.min_level || 0)
          }, 'Material created successfully')}>
            <label>Code<input value={material.code} onChange={e => setMaterial({ ...material, code: e.target.value })} required /></label>
            <label>Name<input value={material.name} onChange={e => setMaterial({ ...material, name: e.target.value })} required /></label>
            <label>Unit<input value={material.unit} onChange={e => setMaterial({ ...material, unit: e.target.value })} /></label>
            <label>Minimum Level<input type="number" value={material.min_level} onChange={e => setMaterial({ ...material, min_level: e.target.value })} /></label>
            <button type="submit">Save Material</button>
          </form>
        </section>

        <section>
          <h3>Add Supplier</h3>
          <form onSubmit={e => handleSubmit(e, '/suppliers', {
            name: supplier.name,
            contact: supplier.contact
          }, 'Supplier created successfully')}>
            <label>Name<input value={supplier.name} onChange={e => setSupplier({ ...supplier, name: e.target.value })} required /></label>
            <label>Contact<input value={supplier.contact} onChange={e => setSupplier({ ...supplier, contact: e.target.value })} /></label>
            <button type="submit">Save Supplier</button>
          </form>
        </section>

        <section className="full-width">
          <h3>Add Stock</h3>
          <form onSubmit={e => handleSubmit(e, '/stock', {
            material_id: Number(stock.material_id),
            supplier_id: Number(stock.supplier_id) || null,
            quantity: Number(stock.quantity),
            min_level: Number(stock.min_level || 0)
          }, 'Stock level created successfully')}>
            <label>Material<select value={stock.material_id} onChange={e => setStock({ ...stock, material_id: e.target.value })} required>
                <option value="">Select material</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
              </select>
            </label>
            <label>Supplier<select value={stock.supplier_id} onChange={e => setStock({ ...stock, supplier_id: e.target.value })}>
                <option value="">No supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label>Quantity<input type="number" value={stock.quantity} onChange={e => setStock({ ...stock, quantity: e.target.value })} required /></label>
            <label>Minimum Level<input type="number" value={stock.min_level} onChange={e => setStock({ ...stock, min_level: e.target.value })} /></label>
            <button type="submit">Save Stock</button>
          </form>
        </section>
      </div>
    </div>
  )
}
