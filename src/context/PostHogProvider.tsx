import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useLocation } from 'react-router-dom'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const location = useLocation()

  useEffect(() => {
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST

    if (!posthogKey) {
      console.warn('PostHog API key is not configured')
      return
    }

    // Initialize PostHog
    posthog.init(posthogKey, {
      api_host: posthogHost || 'https://app.posthog.com',
      autocapture: false,
      capture_pageview: false, // Manually handle pageviews
      loaded: (posthog) => {
        if (import.meta.env.DEV) posthog.debug()
      }
    })

    // Capture pageview on location change
    posthog.capture('$pageview', {
      $current_url: window.location.href
    })

    // Cleanup
    return () => {
      // Optional: Reset the PostHog instance
      posthog.reset()
    }
  }, [location])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

