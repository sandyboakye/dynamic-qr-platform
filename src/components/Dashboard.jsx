import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, Users, QrCode, Eye } from 'lucide-react'

const API_BASE = 'http://localhost:3001/api'

function Dashboard({ qrCodes }) {
  const [analytics, setAnalytics] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchRecentActivity()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/activity/recent?limit=10`)
      setRecentActivity(response.data)
    } catch (error) {
      console.error('Failed to fetch recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total QR Codes',
      value: analytics?.totalQrCodes || 0,
      icon: QrCode,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Scans',
      value: analytics?.totalScans || 0,
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      name: 'Unique Visitors',
      value: analytics?.totalUniqueScans || 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Active QR Codes',
      value: qrCodes.filter(qr => qr.isActive).length,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing QR Codes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Top Performing QR Codes
          </h3>
          <div className="space-y-4">
            {analytics?.qrCodes
              ?.sort((a, b) => b.totalScans - a.totalScans)
              .slice(0, 5)
              .map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{qr.name}</h4>
                    <p className="text-sm text-gray-500">Code: {qr.shortCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {qr.totalScans} scans
                    </p>
                    <p className="text-xs text-gray-500">
                      {qr.uniqueScans} unique
                    </p>
                  </div>
                </div>
              ))}
            {(!analytics?.qrCodes || analytics.qrCodes.length === 0) && (
              <p className="text-gray-500 text-center py-4">No QR codes created yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, idx) => (
                <li key={idx}>
                  <div className="relative pb-8">
                    {idx !== recentActivity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <Eye className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            QR scan for <span className="font-medium text-gray-900">{activity.qr_name}</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.device_type} • {activity.short_code}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {new Date(activity.scanned_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {recentActivity.length === 0 && (
                <li className="text-gray-500 text-center py-4">No recent activity</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard