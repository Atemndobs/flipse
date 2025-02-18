const PlatformSupport = () => {
  const platforms = [
    {
      name: "Telegram",
      description: "Instant price drop notifications",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 16.03C15.37 16.82 15.09 17.07 14.83 17.09C14.25 17.14 13.81 16.71 13.24 16.34C12.33 15.78 11.83 15.44 10.95 14.89C9.94 14.27 10.6 13.93 11.19 13.32C11.36 13.15 13.83 10.92 13.87 10.7C13.8775 10.6617 13.8775 10.6217 13.87 10.5833C13.8625 10.545 13.8476 10.5096 13.8267 10.4793C13.8058 10.449 13.7792 10.4245 13.7489 10.4075C13.7186 10.3905 13.6853 10.3813 13.652 10.3808C13.6187 10.3803 13.5852 10.3885 13.5545 10.4047C13.49 10.4347 12.37 11.165 10.19 12.595C9.77 12.885 9.39 13.025 9.06 13.015C8.68 13.005 7.96 12.805 7.42 12.635C6.75 12.43 6.23 12.32 6.27 11.96C6.29 11.77 6.55 11.58 7.05 11.39C9.43 10.33 11 9.61 11.77 9.23C14.01 8.16 14.56 7.96 14.93 7.96C15.02 7.96 15.24 7.98 15.38 8.1C15.5 8.2 15.53 8.34 15.54 8.44C15.53 8.52 15.55 8.73 15.64 8.8H16.64Z" fill="#229ED9"/>
        </svg>
      )
    },
    {
      name: "Discord",
      description: "Community discussions & smart alerts",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4C14.85 4.29 14.68 4.69 14.55 5C12.98 4.76 11.43 4.76 9.9 5C9.77 4.69 9.59 4.29 9.44 4C7.94 4.26 6.49 4.71 5.17 5.33C2.53 9.24 1.75 13.05 2.14 16.81C3.98 18.21 5.75 19.09 7.49 19.67C7.93 19.07 8.32 18.43 8.66 17.76C8.05 17.55 7.47 17.27 6.92 16.95C7.06 16.84 7.19 16.73 7.32 16.62C10.78 18.23 14.53 18.23 17.95 16.62C18.08 16.74 18.22 16.84 18.35 16.95C17.8 17.28 17.21 17.56 16.6 17.77C16.94 18.44 17.33 19.08 17.77 19.67C19.51 19.09 21.29 18.21 23.13 16.81C23.59 12.45 22.36 8.68 19.27 5.33ZM8.68 14.81C7.65 14.81 6.8 13.86 6.8 12.69C6.8 11.52 7.63 10.57 8.68 10.57C9.73 10.57 10.58 11.52 10.56 12.69C10.56 13.86 9.72 14.81 8.68 14.81ZM15.59 14.81C14.56 14.81 13.71 13.86 13.71 12.69C13.71 11.52 14.54 10.57 15.59 10.57C16.64 10.57 17.49 11.52 17.47 12.69C17.47 13.86 16.64 14.81 15.59 14.81Z" fill="#5865F2"/>
        </svg>
      )
    },
    {
      name: "WhatsApp",
      description: "Private ticket alerts & deals",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.7 2.37 15.3 3.03 16.76L2 22L7.24 20.97C8.7 21.63 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 15.59C16.85 16.04 16.18 16.5 15.73 16.6C15.28 16.71 14.65 16.76 13.41 16.31C11.88 15.77 9.17 13.16 8.63 11.63C8.18 10.39 8.23 9.76 8.34 9.31C8.44 8.86 8.9 8.19 9.35 8.04C9.8 7.89 10.04 7.9 10.26 8.12L11.46 9.57C11.66 9.82 11.55 10.12 11.45 10.32C11.35 10.52 11.15 10.87 10.98 11.09C10.81 11.31 10.53 11.6 10.73 11.95C10.93 12.3 11.74 13.56 12.87 14.57C14 15.58 15.27 16.39 15.62 16.59C15.97 16.79 16.26 16.51 16.48 16.34C16.7 16.17 17.05 15.97 17.25 15.87C17.45 15.77 17.75 15.66 18 15.86L19.45 17.06C19.67 17.28 19.68 17.52 19.53 17.97C19.53 17.57 17 15.59 17 15.59Z" fill="#25D366"/>
        </svg>
      )
    },
    {
      name: "Web Push",
      description: "Browser notifications for updates",
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C10.8954 22 10 21.1046 10 20H14C14 21.1046 13.1046 22 12 22ZM20 19H4V17L6 16V10.5C6 7.038 7.421 4.793 10 4.18V2H14V4.18C16.579 4.793 18 7.038 18 10.5V16L20 17V19ZM12 5.75C9.67 5.75 8 7.34 8 10.5V17H16V10.5C16 7.34 14.33 5.75 12 5.75Z" fill="#4A5568"/>
        </svg>
      )
    }
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Alerts Anywhere
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated on ticket prices across your favorite platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-full">
                  {platform.logo}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {platform.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {platform.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlatformSupport
