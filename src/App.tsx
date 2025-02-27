import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import AdminLogin from './components/AdminLogin'
import Navbar from './components/Navbar'
import Features from './components/Features'
import PlatformSupport from './components/PlatformSupport'
import HowItWorks from './components/HowItWorks'
import CallToAction from './components/CallToAction'
// import ThemeSwitcher from './components/ThemeSwitcher'
// import ChatFlow from './components/ChatFlow'
import { useTheme } from './context/ThemeContext'
import { PostHogProvider } from './context/PostHogProvider'

const App = () => {
  const { theme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)

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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Router>
        <PostHogProvider>
          {isAdmin ? <Navbar /> : <div></div>}
          <Navbar /> 
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Features />
                <PlatformSupport />
                <HowItWorks />
                {/* <ChatFlow />  */}
                <CallToAction />
              </main>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<AdminLogin />} />
          </Routes>
        </PostHogProvider>
      </Router>
    </div>
  )
}

export default App
