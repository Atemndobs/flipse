import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

interface WaitlistEntry {
  id: string
  email: string
  created_at: string
  country?: string
  device_type?: string
  status?: string
  visit_count?: number
}

interface Stats {
  total: number
  activeUsers: number
  totalVisitors: number
  convertedVisitors: number
  countriesBreakdown: {
    name: string
    visitors: number
    conversions: number
  }[]
  deviceBreakdown: Record<string, number>
}

const Dashboard = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
    }
  }

  const fetchData = async () => {
    try {
      // Fetch waitlist entries
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })

      if (waitlistError) throw waitlistError

      // Fetch visitor stats
      const { data: visitorStats, error: visitorError } = await supabase
        .from('visitors')
        .select('*')

      if (visitorError) throw visitorError

      const convertedVisitors = waitlistData.length

      setEntries(waitlistData)

      // Calculate country stats
      const countryStats = new Map()
      
      // Process visitors
      visitorStats.forEach(visitor => {
        const country = visitor.country || 'Unknown'
        if (!countryStats.has(country)) {
          countryStats.set(country, { visitors: 0, conversions: 0 })
        }
        const stats = countryStats.get(country)
        stats.visitors++
        if (visitor.converted) {
          stats.conversions++
        }
      })

      // Convert to array and sort by visitors
      const countriesBreakdown = Array.from(countryStats.entries())
        .map(([name, stats]) => ({
          name,
          ...stats
        }))
        .sort((a, b) => b.visitors - a.visitors)

      // Calculate stats
      const stats: Stats = {
        total: waitlistData.length,
        activeUsers: waitlistData.filter(entry => entry.status === 'active').length,
        totalVisitors: visitorStats.length,
        convertedVisitors,
        countriesBreakdown,
        deviceBreakdown: {} // existing device breakdown logic
      }

      setStats(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut()
  //   navigate('/login')
  // }

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {/* <h1 className="text-3xl font-bold">Admin Dashboard</h1> */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Visitors</h3>
            <p className="text-3xl font-bold">{stats?.totalVisitors || 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Signed Up Users</h3>
            <p className="text-3xl font-bold">{stats?.convertedVisitors || 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold">
              {stats?.totalVisitors 
                ? ((stats.convertedVisitors / stats.totalVisitors) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Bounce Rate</h3>
            <p className="text-3xl font-bold">
              {stats?.totalVisitors 
                ? (((stats.totalVisitors - stats.convertedVisitors) / stats.totalVisitors) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Countries</h3>
            <p className="text-3xl font-bold">
              {Object.keys(stats?.countriesBreakdown || {}).length}
            </p>
          </div>
        </div>

        {/* Add a new section for country breakdown */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Country Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-2">Country</th>
                  <th className="pb-2">Total Visitors</th>
                  <th className="pb-2">Signed Up</th>
                  <th className="pb-2">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats?.countriesBreakdown.map(country => (
                  <tr key={country.name} className="border-b border-gray-700">
                    <td className="py-2">{country.name}</td>
                    <td className="py-2">{country.visitors}</td>
                    <td className="py-2">{country.conversions}</td>
                    <td className="py-2">
                      {((country.conversions / country.visitors) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Waitlist Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Country</th>
                <th className="px-6 py-3 text-left">Device</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-700">
                  <td className="px-6 py-4">{entry.email}</td>
                  <td className="px-6 py-4">{entry.country || '-'}</td>
                  <td className="px-6 py-4">{entry.device_type || '-'}</td>
                  <td className="px-6 py-4">{entry.status || 'active'}</td>
                  <td className="px-6 py-4">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
