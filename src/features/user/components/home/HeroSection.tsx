
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-xl animate-slide-up">
            <span className="bg-yellow-500/20 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6 border border-yellow-500/30">
              Premium Cab Service
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Your Ride, Your Way with{" "}
              <span className="text-yellow-400">Pick2Me</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-8 md:pr-12">
              Experience premium cab service that puts you in control. Book your perfect ride in seconds and travel with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
    </section>
  );
};

export default HeroSection;