import { motion } from 'framer-motion'
import { MessageSquare, Bot, User, Ticket, ExternalLink } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

const HowItWorks = () => {
  const conversations = [
    {
      type: 'user',
      message: 'Hi, I\'m looking for Playoffs tickets in Phoenix',
      intent: 'Ticket Search',
    },
    {
      type: 'bot',
      message: (
        <div className="space-y-4">
          <p>I found 3 available tickets for the Playoffs in Phoenix. Here are the best options:</p>
          
          <div className="space-y-3">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Source: StubHub</p>
                  <p className="text-green-600 dark:text-green-400 font-bold">Price: $1,682</p>
                </div>
                <a 
                  href="https://www.stubhub.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Buy Ticket <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Source: SeatGeek</p>
                  <p className="text-green-600 dark:text-green-400 font-bold">Price: $1,789</p>
                </div>
                <a 
                  href="https://www.seatgeek.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Buy Ticket <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Source: Ticketmaster</p>
                  <p className="text-green-600 dark:text-green-400 font-bold">Price: $1,895</p>
                </div>
                <a 
                  href="https://www.ticketmaster.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Buy Ticket <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
      intent: 'Ticket Options',
    },
    {
      type: 'user',
      message: 'These are a bit expensive. Can you notify me if prices drop below $1,500?',
      intent: 'Price Alert Request',
    },
    {
      type: 'bot',
      message: (
        <div>
          <p className="text-gray-900 dark:text-white">I've set up a price alert for Playoffs tickets in Phoenix:</p>
          <div className="mt-2 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-gray-900 dark:text-white"><span className="font-semibold">Alert set for:</span> Below $1,500</p>
            <p className="text-gray-900 dark:text-white"><span className="font-semibold">Notification channels:</span> Email, Push notifications</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">I'll notify you immediately when tickets match your criteria.</p>
          </div>
        </div>
      ),
      intent: 'Alert Confirmation',
    }
  ]

  return (
    <div className="relative bg-white dark:bg-gray-950 py-24 overflow-hidden" id="how-it-works">
      {/* Add ThemeSwitcher component */}
      <ThemeSwitcher />
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb20_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb20_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real-Time Ticket Search & Alerts
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            See how easy it is to find the best ticket deals and set up price alerts
          </motion.p>
        </div>

        {/* Conversation Flow */}
        <div className="max-w-4xl mx-auto">
          {conversations.map((item, index) => (
            <motion.div
              key={index}
              className={`flex gap-4 mb-8 ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, x: item.type === 'user' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Message */}
              <div className={`
                flex max-w-2xl rounded-2xl p-6 
                ${item.type === 'user' 
                  ? 'bg-blue-600 text-white ml-12' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-12'
                }
              `}>
                <div className="flex-shrink-0 mr-4">
                  {item.type === 'user' 
                    ? <User className="w-6 h-6 text-blue-200" />
                    : <Bot className="w-6 h-6 text-gray-500 dark:text-gray-600" />
                  }
                </div>
                <div>
                  {item.message}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-Time Search</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Instant results from multiple sources</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Prices</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Compare across all major platforms</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Alerts</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Get notified when prices drop</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
