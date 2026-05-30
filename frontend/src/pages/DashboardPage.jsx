import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts'
import { FiTrendingUp, FiTrendingDown, FiBox, FiTruck, FiAlertTriangle, FiDollarSign } from 'react-icons/fi'
import { dashboardService, stockService } from '../services/api'

const chartColors = ['#1E3A5F', '#FFB020', '#00C853', '#2196F3', '#FF5252']

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({})
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const [metricsRes, lowStockRes] = await Promise.all([
          dashboardService.getMetrics(),
          stockService.getLowStock()
        ])
        setMetrics(metricsRes.data || {})
        setAlerts(lowStockRes.data || [])
      } catch (err) {
        setError(err.message || 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const consumptionData = useMemo(() => {
    if (metrics.monthlyConsumption?.length) {
      return metrics.monthlyConsumption.map((value, index) => ({ name: `M${index + 1}`, value }))
    }
    return [
      { name: 'Jan', value: 62 },
      { name: 'Feb', value: 55 },
      { name: 'Mar', value: 77 },
      { name: 'Apr', value: 68 },
      { name: 'May', value: 88 },
      { name: 'Jun', value: 79 }
    ]
  }, [metrics])

  const categoryData = useMemo(() => {
    if (metrics.categoryDistribution?.length) {
      return metrics.categoryDistribution
    }
    return [
      { name: 'Steel', value: 46 },
      { name: 'Alloys', value: 21 },
      { name: 'Chemicals', value: 13 },
      { name: 'Consumables', value: 20 }
    ]
  }, [metrics])

  const trendData = useMemo(() => {
    if (metrics.inventoryMovement?.length) {
      return metrics.inventoryMovement
    }
    return [
      { name: 'Week 1', value: 120 },
      { name: 'Week 2', value: 138 },
      { name: 'Week 3', value: 104 },
      { name: 'Week 4', value: 155 }
    ]
  }, [metrics])

  const statusCards = [
    {
      title: 'Total Materials',
      value: metrics.totalMaterials ?? 0,
      trend: metrics.materialTrend ?? '+12.8%',
      icon: <FiBox />,
      color: 'primary'
    },
    {
      title: 'Available Stock',
      value: metrics.availableStock ?? 0,
      trend: metrics.stockTrend ?? '+8.4%',
      icon: <FiTruck />,
      color: 'info'
    },
    {
      title: 'Low Stock',
      value: metrics.lowStockItems ?? 0,
      trend: metrics.lowStockTrend ?? '-6.3%',
      icon: <FiAlertTriangle />,
      color: 'warning'
    },
    {
      title: 'Inventory Value',
      value: metrics.inventoryValue ? `₹${metrics.inventoryValue.toLocaleString()}` : '₹82.4M',
      trend: metrics.valueTrend ?? '+5.1%',
      icon: <FiDollarSign />,
      color: 'success'
    }
  ]

  return (
    <main className="page-content dashboard-page">
      <div className="page-header dashboard-header">
        <div>
          <span className="eyebrow">Executive Overview</span>
          <h2>Steel Plant Inventory Command Center</h2>
          <p>Enterprise-grade analytics for materials, suppliers, stock movements and operational readiness.</p>
        </div>
      </div>

      {loading && <div className="alert info">Loading dashboard...</div>}
      {error && <div className="alert danger">{error}</div>}

      <div className="kpi-grid">
        {statusCards.map(card => (
          <motion.article
            key={card.title}
            className={`kpi-card kpi-${card.color}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="kpi-top">
              <div className="kpi-icon">{card.icon}</div>
              <div className="kpi-meta">
                <span>{card.title}</span>
                <strong>{card.value}</strong>
              </div>
            </div>
            <div className="kpi-footer">
              <span>{card.trend}</span>
              <span>vs last month</span>
            </div>
          </motion.article>
        ))}
      </div>

      <section className="chart-grid">
        <motion.div className="chart-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="chart-card-header">
            <div>
              <h3>Monthly Consumption</h3>
              <p>Material usage pattern for production planning.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={consumptionData} margin={{ top: 12, right: 0, left: -12, bottom: 0 }}>
              <CartesianGrid opacity={0.08} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111823', border: 'none', borderRadius: 14 }} labelStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#FFB020" strokeWidth={3} dot={{ r: 4, fill: '#FFB020' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="chart-card-header">
            <div>
              <h3>Material Category Mix</h3>
              <p>Distribution of material families across the warehouse.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={96} paddingAngle={4} stroke="none">
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#111823', border: 'none', borderRadius: 14 }} labelStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-card wide-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="chart-card-header">
            <div>
              <h3>Inventory Movement Trend</h3>
              <p>Inbound versus outbound stock velocity over the month.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trendData} margin={{ top: 10, right: 14, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" opacity={0.08} />
              <XAxis dataKey="name" tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9cb3c9', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111823', border: 'none', borderRadius: 14 }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="value" fill="#1E3A5F" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="chart-card status-meter" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="chart-card-header">
            <div>
              <h3>Warehouse Utilization</h3>
              <p>Capacity and safety buffer.</p>
            </div>
          </div>
          <div className="meter-shell">
            <div className="meter-value">{metrics.warehouseUtilization ?? 72}%</div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${metrics.warehouseUtilization ?? 72}%` }} />
            </div>
          </div>
          <div className="metric-lead">
            <span>{metrics.pendingOrders ?? 8} pending orders</span>
            <span>{metrics.reorderPrediction ?? 'Next reorder in 6 days'}</span>
          </div>
        </motion.div>
      </section>

      {alerts.length > 0 && (
        <section className="table-section report-table">
          <div className="table-header">
            <h3>Immediate Low Stock Alerts</h3>
            <span>{alerts.length} items require attention</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Warehouse</th>
                <th>Available</th>
                <th>Minimum</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {alerts.slice(0, 6).map(item => (
                <tr key={item.stockId} className="low-stock-row">
                  <td>{item.material?.materialName}</td>
                  <td>{item.warehouseName ?? 'Main Plant'}</td>
                  <td>{item.availableStock}</td>
                  <td>{item.minimumStock}</td>
                  <td><span className="badge badge-warning">Low stock</span></td>
                  <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}
