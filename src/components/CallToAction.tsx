import { useState, useRef } from 'react'
import WaitlistModal from './WaitlistModal'
import { createClient } from '@supabase/supabase-js'

const CallToAction = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase configuration')
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Try to insert directly without checking first
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }])
        .select()

      // Handle the response
      if (insertError) {
        // If it's a duplicate email, treat it as success
        if (insertError.code === '23505') {
          setSubmittedEmail(email)
          setIsModalOpen(true)
          formRef.current?.reset()
          return
        }
        
        // For any other error, throw it
        throw new Error('Failed to join waitlist. Please try again.')
      }

      // If we get here, the insert was successful
      setSubmittedEmail(email)
      setIsModalOpen(true)
      formRef.current?.reset()
      
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

  return (
    <div className="bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Join our waitlist to be the first to know when we launch and get exclusive early access.
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
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
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
    </div>
  )
}

export default CallToAction
