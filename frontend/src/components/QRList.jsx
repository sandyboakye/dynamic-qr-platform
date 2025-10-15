import { useState } from 'react'
import axios from 'axios'
import { Edit2, Eye, EyeOff, Trash2, ExternalLink, Copy, Download, BarChart3 } from 'lucide-react'

const API_BASE = 'http://localhost:3001/api'

function QRList({ qrCodes, onUpdate, loading }) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', currentUrl: '' })
  const [updatingId, setUpdatingId] = useState(null)

  const startEdit = (qr) => {
    setEditingId(qr.id)
    setEditForm({ name: qr.name, currentUrl: qr.currentUrl })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', currentUrl: '' })
  }

  const saveEdit = async (id) => {
    try {
      setUpdatingId(id)
      await axios.put(`${API_BASE}/qr/${id}`, editForm)
      setEditingId(null)
      setEditForm({ name: '', currentUrl: '' })
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update QR code:', error)
      alert('Failed to update QR code')
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleActive = async (id, isActive) => {
    try {
      await axios.put(`${API_BASE}/qr/${id}`, { isActive: !isActive })
      onUpdate?.()
    } catch (error) {
      console.error('Failed to toggle QR code:', error)
    }
  }

  const deleteQR = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await axios.delete(`${API_BASE}/qr/${id}`)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to delete QR code:', error)
      alert('Failed to delete QR code')
    }
  }

  const downloadQR = (qr) => {
    const link = document.createElement('a')
    link.download = `${qr.name}-qr-code.png`
    link.href = qr.qrImageUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first dynamic QR code.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {qrCodes.map((qr) => (
          <li key={qr.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={qr.qrImageUrl}
                    alt={`QR Code for ${qr.name}`}
                    className="h-16 w-16 border rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === qr.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-1 border"
                        placeholder="QR Code Name"
                      />
                      <input
                        type="url"
                        value={editForm.currentUrl}
                        onChange={(e) => setEditForm(prev => ({ ...prev, currentUrl: e.target.value }))}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-1 border"
                        placeholder="Destination URL"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {qr.name}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          qr.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {qr.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {qr.shortCode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {qr.currentUrl}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(qr.createdAt).toLocaleDateString()}
                        {qr.updatedAt !== qr.createdAt && (
                          <span> • Updated: {new Date(qr.updatedAt).toLocaleDateString()}</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {editingId === qr.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(qr.id)}
                      disabled={updatingId === qr.id}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === qr.id ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => copyToClipboard(`http://localhost:3001/r/${qr.shortCode}`)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Copy QR URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadQR(qr)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download QR Code"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(qr.currentUrl, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Visit URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(qr)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(qr.id, qr.isActive)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title={qr.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {qr.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteQR(qr.id, qr.name)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QRList