import React, { useEffect, useState } from 'react'
import api from './services/api'

export default function App(){
  const [materials,setMaterials] = useState([])
  const [suppliers,setSuppliers] = useState([])
  const [stock,setStock] = useState([])

  useEffect(()=>{
    api.get('/materials').then(res=>setMaterials(res.data)).catch(()=>{});
    api.get('/suppliers').then(res=>setSuppliers(res.data)).catch(()=>{});
    api.get('/stock').then(res=>setStock(res.data)).catch(()=>{});
  },[])

  return (
    <div className="container">
      <h1>Vizag Steel Plant — Inventory</h1>
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
        <ul>{stock.map(s=> <li key={s.id}>{s.material_code} — {s.quantity} (Supplier: {s.supplier_name})</li>)}</ul>
      </section>
    </div>
  )
}
