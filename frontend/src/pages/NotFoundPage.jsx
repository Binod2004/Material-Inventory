import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFoundPage() {
  return (
    <main className="page-content notfound-page">
      <section className="notfound-card">
        <span className="eyebrow">404</span>
        <h2>Page Could Not Be Located</h2>
        <p>The requested route does not exist in the Vizag Steel PMS console. Return to the dashboard to continue managing inventory.</p>
        <Link to="/dashboard" className="button primary">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </section>
    </main>
  )
}
