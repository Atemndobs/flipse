import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import AdminLogin from './components/AdminLogin'
import Navbar from './components/Navbar'
// import Header from './components/Header'
import Features from './components/Features'
import PlatformSupport from './components/PlatformSupport'
import HowItWorks from './components/HowItWorks'
import CallToAction from './components/CallToAction'
import ThemeSwitcher from './components/ThemeSwitcher'
// import ChatFlow from './components/ChatFlow'
import { useTheme } from './context/ThemeContext'

const App = () => {
  const { theme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )

    const { data: { session } } = await supabase.auth.getSession()
    setIsAdmin(!!session)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Router>
        {/* Conditional rendering of Navbar/Header */}
        {isAdmin ? (
          <Navbar />
        ) : (
          // <Header />
          <div></div>
        )}

        {/* Add padding to account for fixed header */}
        {/* <div className="pt-16"> */}
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
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        {/* </div> */}
        <ThemeSwitcher />
      </Router>
    </div>
  )
}

export default App
