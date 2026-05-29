import React, { useEffect, useState } from 'react'
import api from './services/api'
import AdminPage from './pages/AdminPage'

export default function App(){
  const [materials,setMaterials] = useState([])
  const [suppliers,setSuppliers] = useState([])
  const [stock,setStock] = useState([])
  const [activePage,setActivePage] = useState('dashboard')

  const refreshData = () => {
    api.get('/materials').then(res=>setMaterials(res.data)).catch(()=>{})
    api.get('/suppliers').then(res=>setSuppliers(res.data)).catch(()=>{})
    api.get('/stock').then(res=>setStock(res.data)).catch(()=>{})
  }

  useEffect(()=>{
    refreshData()
  },[])

  return (
    <div className="container">
      <h1>Vizag Steel Plant — Inventory</h1>
      <nav className="page-tabs">
        <button className={activePage === 'dashboard' ? 'active' : ''} onClick={()=>setActivePage('dashboard')}>Dashboard</button>
        <button className={activePage === 'admin' ? 'active' : ''} onClick={()=>setActivePage('admin')}>Admin</button>
      </nav>

      {activePage === 'dashboard' ? (
        <>
          <section>
            <h2>Materials</h2>
            <ul>{materials.map(m=> <li key={m.id}>{m.code} — {m.name} ({m.unit})</li>)}</ul>
          </section>
          <section>
            <h2>Suppliers</h2>
            <ul>{suppliers.map(s=> <li key={s.id}>{s.name} — {s.contact}</li>)}</ul>
          </section>
          <section>
            <h2>Stock Levels</h2>
            <ul>{stock.map(s=> <li key={s.id}>{s.material_code} — {s.quantity} (Supplier: {s.supplier_name || 'N/A'})</li>)}</ul>
          </section>
        </>
      ) : (
        <AdminPage materials={materials} suppliers={suppliers} onRefresh={refreshData} />
      )}
    </div>
  )
}
