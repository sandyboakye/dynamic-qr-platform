import { useState } from 'react'
import axios from 'axios'
import { QrCode, Link, Download, Copy, Check } from 'lucide-react'

const API_BASE = 'http://localhost:3001/api'

function CreateQR({ onQRCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    url: ''
  })
  const [loading, setLoading] = useState(false)
  const [createdQR, setCreatedQR] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.url) return

    try {
      setLoading(true)
      const response = await axios.post(`${API_BASE}/qr/create`, formData)
      setCreatedQR(response.data)
      setFormData({ name: '', url: '' })
      onQRCreated?.()
    } catch (error) {
      console.error('Failed to create QR code:', error)
      alert('Failed to create QR code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!createdQR?.qrImageUrl) return
    
    const link = document.createElement('a')
    link.download = `${createdQR.name}-qr-code.png`
    link.href = createdQR.qrImageUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
            Create Dynamic QR Code
          </h3>

          {!createdQR ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  QR Code Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g., My Website, Product Link, etc."
                  required
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Destination URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="https://example.com"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  You can change this URL later without regenerating the QR code
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.url}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Create QR Code
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={createdQR.qrImageUrl}
                    alt={`QR Code for ${createdQR.name}`}
                    className="mx-auto max-w-xs border rounded-lg shadow-sm"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900">{createdQR.name}</h4>
                <p className="text-sm text-gray-500">QR Code created successfully!</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code URL (for scanning)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={createdQR.redirectUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(createdQR.redirectUrl)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Destination
                  </label>
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{createdQR.currentUrl}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Code
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {createdQR.shortCode}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </button>
                <button
                  onClick={() => setCreatedQR(null)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <QrCode className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              How Dynamic QR Codes Work
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Your QR code always points to the same short URL</li>
                <li>You can change where that URL redirects without changing the QR code</li>
                <li>Track scans and analytics in real-time</li>
                <li>Perfect for print materials, business cards, and marketing campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQR