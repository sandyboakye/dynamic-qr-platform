import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart3, TrendingUp, Eye, Users, Smartphone, Monitor, Tablet } from 'lucide-react'

const API_BASE = 'http://localhost:3001/api'

function Analytics({ qrCodes }) {
  const [selectedQR, setSelectedQR] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchQRAnalytics = async (qrId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/analytics/${qrId}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedQR) {
      fetchQRAnalytics(selectedQR.id)
    }
  }, [selectedQR])

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      case 'desktop': return Monitor
      default: return Monitor
    }
  }

  const getDeviceColor = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return 'bg-green-500'
      case 'tablet': return 'bg-purple-500'
      case 'desktop': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics available</h3>
        <p className="mt-1 text-sm text-gray-500">Create some QR codes first to see analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* QR Code Selector */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Select QR Code for Analytics
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qrCodes.map((qr) => (
              <button
                key={qr.id}
                onClick={() => setSelectedQR(qr)}
                className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedQR?.id === qr.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={qr.qrImageUrl}
                    alt={`QR Code for ${qr.name}`}
                    className="h-12 w-12 border rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {qr.name}
                    </h4>
                    <p className="text-xs text-gray-500">{qr.shortCode}</p>
                    <p className={`text-xs ${qr.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {qr.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {selectedQR && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : analytics ? (
            <>
              {/* Summary Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Analytics for "{analytics.qrCode.name}"
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Eye className="h-8 w-8" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-blue-100 truncate">
                              Total Scans
                            </dt>
                            <dd className="text-2xl font-bold">
                              {analytics.summary.totalScans.toLocaleString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-8 w-8" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-green-100 truncate">
                              Unique Visitors
                            </dt>
                            <dd className="text-2xl font-bold">
                              {analytics.summary.uniqueScans.toLocaleString()}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-purple-100 truncate">
                              Scan Rate
                            </dt>
                            <dd className="text-2xl font-bold">
                              {analytics.summary.totalScans > 0 
                                ? `${((analytics.summary.uniqueScans / analytics.summary.totalScans) * 100).toFixed(1)}%`
                                : '0%'
                              }
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BarChart3 className="h-8 w-8" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-orange-100 truncate">
                              Active Days
                            </dt>
                            <dd className="text-2xl font-bold">
                              {Object.keys(analytics.summary.dailyStats || {}).length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Device Breakdown
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(analytics.summary.deviceStats || {}).map(([device, count]) => {
                      const DeviceIcon = getDeviceIcon(device)
                      const deviceColor = getDeviceColor(device)
                      const percentage = analytics.summary.totalScans > 0 
                        ? ((count / analytics.summary.totalScans) * 100).toFixed(1)
                        : 0

                      return (
                        <div key={device} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <div className={`${deviceColor} rounded-md p-2`}>
                              <DeviceIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 capitalize">
                                {device}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {count} scans ({percentage}%)
                              </p>
                            </div>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${deviceColor}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                    {Object.keys(analytics.summary.deviceStats || {}).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No scan data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Daily Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Daily Scan Activity
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.summary.dailyStats || {})
                      .sort(([a], [b]) => new Date(b) - new Date(a))
                      .slice(0, 7)
                      .map(([date, count]) => (
                        <div key={date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm text-gray-900">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ 
                                  width: `${Math.max(10, (count / Math.max(...Object.values(analytics.summary.dailyStats))) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                    {Object.keys(analytics.summary.dailyStats || {}).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No daily activity data</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Analytics