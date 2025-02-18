import { useEffect, useState, useRef } from 'react'
import WaitlistModal from './WaitlistModal'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { UAParser } from 'ua-parser-js'
import CookieBanner from './CookieBanner'

const videos = [
  'https://d3phaj0sisr2ct.cloudfront.net/site/videos/footer-videos/Fabric.mp4',
]

interface VisitorData {
  session_id: string
  referrer: string
  user_agent: string
  country: string | null
  country_code: string | null
  metadata: {
    screen_resolution: string
    language: string
    timezone: string
    timestamp: string
    url: string
  }
}

interface GeoResponse {
  address: {
    city: string
    town: string
    village: string
    state: string
    country_code: string
  }
}

const getLocationData = async (): Promise<{ country: string | null; country_code: string | null }> => {
  try {
    if ('geolocation' in navigator) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false
        })
      })
      
      const { latitude, longitude } = position.coords
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourWebsite (your@email.com)'
          }
        }
      )
      
      if (response.ok) {
        const data: GeoResponse = await response.json()
        if (data.address) {
          return {
            country: `${data.address.city || data.address.town || data.address.village}, ${data.address.state}`,
            country_code: data.address.country_code?.toUpperCase() || null
          }
        }
      }
    }
    return { country: null, country_code: null }
  } catch (error) {
    console.debug('Location data unavailable:', error)
    return { country: null, country_code: null }
  }
}

const trackVisit = async (supabase: SupabaseClient) => {
  try {
    let sessionId = localStorage.getItem('visitor_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('visitor_session_id', sessionId)
    }

    const visitorData: VisitorData = {
      session_id: sessionId,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      country: null,
      country_code: null,
      metadata: {
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    }

    // Only get location if user has accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (cookieConsent === 'accepted') {
      const locationData = await getLocationData()
      visitorData.country = locationData.country
      visitorData.country_code = locationData.country_code
    }

    const { error: visitorError } = await supabase
      .from('visitors')
      .insert([visitorData])

    if (visitorError) {
      console.error('Error inserting visitor:', visitorError)
    } else {
      console.debug('Successfully tracked visit:', {
        country: visitorData.country,
        country_code: visitorData.country_code
      })
    }
  } catch (error) {
    console.error('Error in trackVisit:', error)
  }
}

const Hero = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitializedTracking, setHasInitializedTracking] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 2000)

    // Only initialize tracking if we haven't done so yet
    if (!hasInitializedTracking) {
      const cookieConsent = localStorage.getItem('cookie-consent')
      if (cookieConsent === 'accepted') {
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        )
        trackVisit(supabase)
      }
      setHasInitializedTracking(true)
    }

    return () => {
      clearInterval(interval)
    }
  }, [hasInitializedTracking])

  const getVideoUrl = (url: string) => {
    if (url.includes('youtube')) {
      const videoId = url.split('v=')[1]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Get the visitor's session and country info
      const sessionId = localStorage.getItem('visitor_session_id')
      let countryData = { country: null, country_code: null }
      
      if (sessionId) {
        const { data: visitorData } = await supabase
          .from('visitors')
          .select('country, country_code, metadata')
          .eq('session_id', sessionId)
          .single()

        if (visitorData) {
          countryData = {
            country: visitorData.country,
            country_code: visitorData.country_code
          }
        }
      }

      // Initialize UAParser
      const parser = new UAParser(navigator.userAgent)
      const result = parser.getResult()

      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search)
      const utmSource = urlParams.get('utm_source')
      const utmMedium = urlParams.get('utm_medium')
      const utmCampaign = urlParams.get('utm_campaign')

      // Try to insert into waitlist
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{
          email,
          country: countryData.country,
          country_code: countryData.country_code,
          device_type: result.device.type || result.device.model,
          browser: result.browser.name,
          os: result.os.name,
          referrer: document.referrer,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          signup_platform: 'web',
          metadata: {
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        }])

      // Handle the response
      if (insertError) {
        // If it's a duplicate email (unique constraint violation), treat it as success
        if (insertError.code === '23505') {
          setSubmittedEmail(email)
          setIsModalOpen(true)
          formRef.current?.reset()
          return
        }
        // For any other error, throw it
        throw insertError
      }

      // If we get here, the insert was successful
      setSubmittedEmail(email)
      setIsModalOpen(true)
      formRef.current?.reset()

      // Update visitor record to mark as converted
      if (sessionId) {
        await supabase
          .from('visitors')
          .update({ converted: true })
          .eq('session_id', sessionId)
      }
      
    } catch (err) {
      console.error('Error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Unable to join waitlist. Please try again later.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const currentUrl = getVideoUrl(videos[currentVideoIndex])
  const isYouTube = currentUrl.includes('youtube')

  const handleCookieAccept = () => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    trackVisit(supabase)
  }

  const handleCookieDecline = () => {
    // Still track the visit but without location data
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    trackVisit(supabase)
  }

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {isYouTube ? (
            <iframe
              src={currentUrl}
              className="absolute w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={currentUrl}
              className="absolute w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={currentUrl} type={currentUrl.endsWith('webm') ? 'video/webm' : 'video/mp4'} />
            </video>
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Ultimate Ticket Agent
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-bold">
            Get the best deals on NBA Playoffs, March Madness, concerts, and events. Real-time price alerts ensure you never miss out.
          </p>
          
          {error && (
            <div className="mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form ref={formRef} className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={submittedEmail}
      />
      <CookieBanner 
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </>
  )
}

export default Hero
