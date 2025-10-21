import { useState, useEffect } from 'react'

// Configurable backend URL for API calls and redirect host
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
              📱
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Dynamic QR Platform
            </h1>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Ready to create QR codes!
          </div>
        </div>
      </header>

      {/* Env banner for localhost backend */}
      <EnvBanner />

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '2rem' }}>
          {['Dashboard', 'Create QR', 'My QR Codes', 'Analytics'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              style={{
                padding: '1rem 0.25rem',
                borderBottom: activeTab === tab.toLowerCase().replace(' ', '-') ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.toLowerCase().replace(' ', '-') ? '#3b82f6' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'create-qr' && <CreateQR />}
        {activeTab === 'my-qr-codes' && <MyQRCodes />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  )
}
// Banner to help when backend points to localhost
function EnvBanner() {
  const usingLocalhost = BACKEND_URL.includes('localhost')
  if (!usingLocalhost) return null
  return (
    <div style={{ backgroundColor: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 1rem', color: '#9a3412', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Heads up:</strong> BACKEND_URL is set to <code>localhost</code>. Phone scans can’t reach localhost.
          Set backend <code>PUBLIC_BASE_URL</code> and frontend <code>VITE_BACKEND_URL</code> to your PC’s LAN IP (e.g., <code>http://192.168.x.x:3001</code>), then create a new QR.
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
function Dashboard() {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        📊 Dashboard
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>0</div>
          <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>Total QR Codes</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46' }}>0</div>
          <div style={{ fontSize: '0.875rem', color: '#065f46' }}>Total Scans</div>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>0</div>
          <div style={{ fontSize: '0.875rem', color: '#92400e' }}>Active QR Codes</div>
        </div>
      </div>
      <p style={{ color: '#6b7280' }}>Welcome to your QR code dashboard! Create your first QR code to get started.</p>
    </div>
  )
}

// Create QR Component
function CreateQR() {
  const [formData, setFormData] = useState({ name: '', url: '' })
  const [loading, setLoading] = useState(false)
  const [createdQR, setCreatedQR] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.name || !formData.url) {
      setError('Name and URL are required.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/qr/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to create QR code. Make sure the backend is running on port 3001.')
        setLoading(false)
        return
      }
      setCreatedQR(data)
      setFormData({ name: '', url: '' })
    } catch (err) {
      setError('Failed to create QR code. Make sure the backend is running on port 3001.')
      console.error('Failed to create QR:', err)
    }
    setLoading(false)
  }

  if (createdQR) {
    const redirectUrl = `${BACKEND_URL}/r/${createdQR.shortCode}`
    return (
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
          ✅ QR Code Created!
        </h2>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={createdQR.qrImageUrl} alt="Generated QR Code" style={{ maxWidth: '300px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          <h3 style={{ marginTop: '1rem', color: '#1f2937' }}>{createdQR.name}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Short Code: {createdQR.shortCode}</p>
            <button
              type="button"
              onClick={() => {
                const link = document.createElement('a')
                link.download = `${createdQR.name.replace(/\s+/g, '_')}_QR.png`
                link.href = createdQR.qrImageUrl
                link.click()
              }}
              style={{ marginTop: '0.5rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              💾 Download QR Image
            </button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            QR Code URL (scan this):
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={redirectUrl}
              readOnly
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }}
            />
            <button
              type="button"
              onClick={() => window.open(redirectUrl, '_blank')}
              style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
            >
              Open
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(redirectUrl)
                  alert('Redirect URL copied to clipboard')
                } catch {
                  // Fallback for older browsers
                  const ta = document.createElement('textarea')
                  ta.value = redirectUrl
                  document.body.appendChild(ta)
                  ta.select()
                  document.execCommand('copy')
                  document.body.removeChild(ta)
                  alert('Redirect URL copied to clipboard')
                }
              }}
              style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
            >
              Copy
            </button>
          </div>
        </div>
        {BACKEND_URL.includes('localhost') && (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Tip: Scanning on your phone? Set PUBLIC_BASE_URL in backend and VITE_BACKEND_URL in frontend to your PC's LAN IP (e.g., http://192.168.1.23:3001), then create a new QR.
          </p>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Current Destination:
          </label>
          <input
            type="text"
            value={createdQR.currentUrl}
            readOnly
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }}
          />
        </div>
        <button
          onClick={() => setCreatedQR(null)}
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
        >
          Create Another QR Code
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Create a New QR Code</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
          placeholder="e.g. My Website"
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Destination URL</label>
        <input
          type="url"
          value={formData.url}
          onChange={e => setFormData({ ...formData, url: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
          placeholder="https://example.com"
        />
      </div>
      <button type="submit" disabled={loading} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1.5rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'Creating...' : 'Create QR Code'}
      </button>
    </form>
  )
}

// My QR Codes Component
function MyQRCodes() {
  const [qrs, setQrs] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editUrl, setEditUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchQRCodes = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/qr`)
      const data = await res.json()
      setQrs(Array.isArray(data) ? data : (data.qrCodes || []))
    } catch (err) {
      setError('Failed to load QR codes')
    }
    setLoading(false)
  }

  useEffect(() => { fetchQRCodes() }, [])

  const startEdit = (qr) => {
    setEditId(qr.id)
    setEditUrl(qr.currentUrl)
    setError('')
    setSuccess('')
  }

  const saveEdit = async (id) => {
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/qr/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUrl: editUrl })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setEditId(null)
      setEditUrl('')
      setSuccess('Destination updated successfully!')
      fetchQRCodes()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        📋 My QR Codes
      </h2>
  {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
  {success && <div style={{ color: 'green', marginBottom: '1rem', fontWeight: 'bold' }}>{success}</div>}
      {loading ? <p>Loading...</p> : qrs.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Your created QR codes will appear here. Create your first QR code to get started!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>QR Code</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>Short Code</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>Current Destination</th>
              <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {qrs.map(qr => (
              <tr key={qr.id}>
                  <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <img src={qr.qrImageUrl} alt={qr.name} style={{ width: '60px', height: '60px', cursor: 'pointer' }} 
                      onClick={() => {
                        const link = document.createElement('a')
                        link.download = `${qr.name.replace(/\s+/g, '_')}_QR.png`
                        link.href = qr.qrImageUrl
                        link.click()
                      }}
                      title="Click to download"
                    />
                  </td>
                <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>{qr.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>{qr.shortCode}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                  {editId === qr.id ? (
                    <input type="url" value={editUrl} onChange={e => setEditUrl(e.target.value)} style={{ width: '100%' }} />
                  ) : (
                    qr.currentUrl
                  )}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                  {editId === qr.id ? (
                    <>
                      <button onClick={() => saveEdit(qr.id)} style={{ marginRight: 8, color: '#10b981', border: 'none', background: 'none', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(qr)} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Analytics Component
function Analytics() {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        📈 Analytics
      </h2>
      <p style={{ color: '#6b7280' }}>Scan analytics and statistics will be displayed here once you have active QR codes.</p>
    </div>
  )
}

export default App
