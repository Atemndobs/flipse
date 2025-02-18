import { Bell, Ticket, DollarSign, Zap } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: <Bell className="w-8 h-8 text-blue-400" />,
      title: "Price Alerts",
      description: "Get instant notifications when ticket prices drop to your target range."
    },
    {
      icon: <Ticket className="w-8 h-8 text-blue-400" />,
      title: "Best Value",
      description: "Compare prices across multiple platforms to find the best deals."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-400" />,
      title: "Price History",
      description: "View historical pricing data to make informed buying decisions."
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Instant Updates",
      description: "Real-time updates on ticket availability and price changes."
    }
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-950 py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Ticket Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to secure the best event tickets at the right price
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
