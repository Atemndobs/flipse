// import { useTheme } from '../context/ThemeContext'

const Header = () => {
  // const { theme } = useTheme()
  
  return (
    
    <header className="fixed top-0 w-full bg-white/50 dark:bg-gray-950/50 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">

    {/* <header className="fixed top-0 w-full bg-white/50backdrop-blur-lg z-50 border-none"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* <span className="text-gray-900 dark:text-white text-xl font-bold">Flipse</span> */}
          <span className="text-white text-xl font-bold">Flipse</span>
        </div>
      </div>
    </header>
  )
}

export default Header

