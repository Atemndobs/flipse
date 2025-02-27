import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const isHomePage = location.pathname === '/'

  const handleLogout = async () => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    navigate('/')  // Changed from '/login' to '/'
  }

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials are not configured')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAdmin(false)
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-white/50 dark:bg-gray-950/50 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate('/')}
              className="text-gray-900 dark:text-white text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            >
              Flipse AI
            </span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {isHomePage && (
                <>
                  <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    How It Works
                  </a>
                  <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Features
                  </a>
                  {/* <a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Demo
                  </a> */}
                </>
              )}
              {isAdmin ?
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
                  title="Go to Dashboard"
                >
                  Dashboard
                </button>
                : <div></div>}

              {isAdmin ?
                <button
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
                  title="Sign Out"
                >
                  Sign Out
                </button>

                : <div></div>}
              {isAdmin ?
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                : <div></div>}
            </div>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
              title="Go to Dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
              title="Sign Out"
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              type="button"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              title="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
