const VideoSection = () => {
  return (
    <div className="bg-gray-900 py-24" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Flipse in Action
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch how easy it is to find and secure the best ticket deals
          </p>
        </div>
        
        <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden">
          <iframe
            src="https://flixier.com/view/cx1oXky6"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default VideoSection
