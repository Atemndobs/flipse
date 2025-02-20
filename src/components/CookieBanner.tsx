import { useState, useEffect } from 'react'

interface CookieBannerProps {
  onAccept: () => void
  onDecline: () => void
}

const CookieBanner = ({ onAccept, onDecline }: CookieBannerProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setIsVisible(true)
    } else if (cookieConsent === 'accepted') {
      onAccept()
    } else if (cookieConsent === 'declined') {
      onDecline()
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
          <p className="text-sm text-gray-300">
            We use essential cookies to ensure the basic functionality of our website and to enhance your experience. 
            By clicking "Accept", you consent to our use of cookies and allow us to collect anonymous location data 
            to improve our services. You can decline and still use our website with limited functionality.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
