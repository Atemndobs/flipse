import { useState, useRef, FormEvent, useEffect } from 'react'
import WaitlistModal from './WaitlistModal'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { UAParser } from 'ua-parser-js'
import CookieBanner from './CookieBanner'
import { usePostHog } from 'posthog-js/react'
import ErrorBoundary from './ErrorBoundary'

const videos = [
  // 'https://d3phaj0sisr2ct.cloudfront.net/site/videos/footer-videos/Fabric.mp4',
  // 'https://minio.goose-neon.ts.net/curator/video/4729196-hd_1920_1080_25fps.mp4',
  'https://minio.goose-neon.ts.net/curator/video/11979239_2160_3840_60fps.mp4',
  'https://minio.goose-neon.ts.net/curator/video/16472277-uhd_2160_3840_60fps.mp4',
]

interface VisitorData {
  session_id: string
  referrer?: string
  user_agent?: string,
  country?: string,
  country_code?: string,
  metadata: {
    screen_resolution: string
    language: string
    timezone: string
    timestamp: string
    url: string
  }
}

// Moved trackVisit outside component since it's used in multiple places
const trackVisit = async (supabase: SupabaseClient, includeLocation: boolean = false) => {
  try {
    const visitorData: VisitorData = {
      session_id: crypto.randomUUID(),
      referrer: 'static_referrer',
      user_agent: 'static_user_agent',
      country: '',
      country_code: '',
      metadata: {
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    }

    console.log({
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
    

    if (includeLocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 0,
            enableHighAccuracy: false
          });
        });
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        );
        const data = await response.json();
        
        if (data.address) {
          visitorData.country = data.address.country;
          visitorData.country_code = data.address.country_code?.toUpperCase();
        }
      } catch (error) {
        // Silently handle geolocation errors - just continue without location data
        console.log('Location access not available:', error);
      }
    }

    const { data, error } = await supabase
      .from('visitors')
      .insert([visitorData])
      .select();

    if (error) {
      throw error;
    }

    console.log('Visitor tracked successfully:', data);
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

const Hero = () => {
  const [currentUrl] = useState(videos[0]) // Removed unused setter
  const [isYouTube] = useState(false) // Removed unused setter
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const posthog = usePostHog()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )

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
        // If it's a duplicate email, treat it as success
        if (insertError.code === '23505') {
          setSubmittedEmail(email)
          setIsModalOpen(true)
          formRef.current?.reset()
          return
        }
        console.log({insertError});
        
        // For any other error, throw it
        throw new Error('Failed to join waitlist. Please try again.')
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
          : 'An error occurred while joining the waitlist'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCookieAccept = () => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )

    navigator.geolocation.getCurrentPosition(
      () => {
        // Geolocation permission granted
        trackVisit(supabase, true);
      },
      () => {
        // Geolocation permission denied or error
        trackVisit(supabase, false);
      }
    );
  }

  const handleCookieDecline = () => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    // Track visit without location data when cookies are declined
    trackVisit(supabase, false)
    
    // Disable PostHog tracking
    posthog?.opt_out_capturing()
  }

  useEffect(() => {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('Supabase connection error:', error)
        } else {
          console.log('Supabase connection successful. Visitor count:', count)
        }
      })
  }, [])

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
              <source src={currentUrl} type="video/mp4" />
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

export default function WrappedHero() {
  return (
    <ErrorBoundary>
      <Hero />
    </ErrorBoundary>
  );
}
