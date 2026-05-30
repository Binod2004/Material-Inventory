import React, { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { FiFileText, FiDownload, FiShield } from 'react-icons/fi'
import api from '../services/api'

export default function ReportsPage() {
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    api.get('/stock/low').then(res => setLowStock(res.data || [])).catch(() => {})
  }, [])

  const reportData = useMemo(() => {
    return lowStock.length
      ? lowStock.map(item => ({ name: item.material?.materialName ?? 'Material', value: item.availableStock }))
      : [
          { name: 'Steel', value: 28 },
          { name: 'Alloys', value: 18 },
          { name: 'Chemicals', value: 13 },
          { name: 'Consumables', value: 7 }
        ]
  }, [lowStock])

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">Reports Center</span>
          <h2>Operational Intelligence Reports</h2>
          <p>Generate valuation, movement, and supplier performance analytics for plant operations.</p>
        </div>
      </div>

      <section className="toolbar-panel report-toolbar">
        <div>
          <button className="button outline"><FiFileText /> Inventory Valuation</button>
          <button className="button outline"><FiDownload /> Export PDF</button>
          <button className="button outline"><FiDownload /> Export Excel</button>
        </div>
      </section>

      <section className="report-cards">
        <article className="report-card report-primary">
          <header>
            <span>Stock Movement</span>
            <FiShield />
          </header>
          <strong>{lowStock.length} Low Stock Items</strong>
          <p>Alerts generated from current inventory health.</p>
        </article>
        <article className="report-card report-secondary">
          <header>
            <span>Last Updated</span>
            <FiShield />
          </header>
          <strong>{new Date().toLocaleDateString()}</strong>
          <p>Real-time report generation for executive review.</p>
        </article>
      </section>

      <section className="chart-card report-chart">
        <div className="chart-card-header">
          <div>
            <h3>Low Stock Overview</h3>
            <p>Available stock levels by material family.</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={reportData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" opacity={0.08} />
            <XAxis dataKey="name" tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111823', border: 'none', borderRadius: 14 }} labelStyle={{ color: '#fff' }} />
            <Bar dataKey="value" fill="#FFB020" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="table-section">
        <div className="table-header">
          <h3>Low Stock Material List</h3>
          <span>{lowStock.length} items</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Material</th><th>Available</th><th>Minimum</th><th>Status</th><th>Last Updated</th></tr>
            </thead>
            <tbody>
              {lowStock.map(item => (
                <tr key={item.stockId}>
                  <td>{item.material?.materialName}</td>
                  <td>{item.availableStock}</td>
                  <td>{item.minimumStock}</td>
                  <td><span className="badge badge-warning">Low stock</span></td>
                  <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
