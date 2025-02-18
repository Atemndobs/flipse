import { motion } from 'framer-motion'

const ChatFlow = () => {
  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How Our System Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow the conversation flow to see how we help you get the best tickets
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Success Path */}
          <div className="mb-16">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <h3 className="text-xl font-semibold text-white">Success Path</h3>
            </div>
            
            <div className="space-y-4">
              <motion.div
                className="bg-blue-500 text-white p-4 rounded-lg ml-auto max-w-md"
                variants={messageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 0.2 }}
              >
                I'm looking for Superbowl tickets
              </motion.div>

              <motion.div
                className="bg-gray-800 text-white p-4 rounded-lg max-w-md"
                variants={messageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 0.4 }}
              >
                I found 42 tickets available. The best deal is $2,500 in section 124.
              </motion.div>

              <motion.div
                className="bg-blue-500 text-white p-4 rounded-lg ml-auto max-w-md"
                variants={messageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 0.6 }}
              >
                Great! I'll take it
              </motion.div>
            </div>
          </div>

          {/* Alert Path */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <h3 className="text-xl font-semibold text-white">Price Alert Path</h3>
            </div>
            
            <div className="space-y-4">
              <motion.div
                className="bg-blue-500 text-white p-4 rounded-lg ml-auto max-w-md"
                variants={messageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 0.8 }}
              >
                That's above my budget. Can you alert me if prices drop below $2,000?
              </motion.div>

              <motion.div
                className="bg-gray-800 text-white p-4 rounded-lg max-w-md"
                variants={messageVariants}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: 1 }}
              >
                Price alert set! I'll notify you instantly when tickets match your criteria.
              </motion.div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-300">Purchase Flow</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-gray-300">Alert Subscription</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatFlow
