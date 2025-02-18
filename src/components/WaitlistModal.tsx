import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

const WaitlistModal = ({ isOpen, onClose, email }: WaitlistModalProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-300 mb-4">
            We've added <span className="font-semibold">{email}</span> to our waitlist.
          </p>
          <p className="text-gray-400 text-sm">
            You'll be among the first to know when Flipse launches in your region.
            We're working hard to bring you the best ticket deals!
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WaitlistModal
