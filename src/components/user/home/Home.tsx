import Footer from "./Footer";
import NavBar from "./Navbar";
import { MapPinIcon } from "@heroicons/react/24/solid";
import WhySafely from "./WhySafety";

function Home() {
  return (
    <div className="">
      {/* NavBar */}
      <NavBar />

      {/* Banner */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 bg-black text-white p-6">
          <div className="mt-20 md:mt-40 md:ml-56 text-center md:text-left">
            <h4 className="text-2xl font-bold mb-4">
              Ready To Assist Anywhere With Go & Go
            </h4>
            <p>Tap, Book, Ride, Go, Enjoy!</p>
          </div>
          <div className="relative items-center w-full md:w-1/2 md:ml-52 mt-10 mx-auto md:mx-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Pickup Location"
                className="border-2 border-gray-300 rounded-full px-4 py-2 w-full pl-10"
              />
              <MapPinIcon 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" 
              />
            </div>
          </div>
          <div className="relative items-center w-full md:w-1/2 md:ml-52 mt-10 mx-auto md:mx-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Dropoff Location"
                className="border-2 border-gray-300 rounded-full px-4 py-2 w-full pl-10"
              />
              <MapPinIcon 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" 
              />
            </div>
          </div>
          <button className="bg-yellow-400 h-9 w-full md:w-[19%] mx-auto md:ml-[54%] mt-9 rounded text-black">
            See Prices
          </button>
        </div>
        <div className="w-full md:w-1/2 bg-black text-white p-6">
          <img
            src="/images/IMG_2663.JPG"
            alt="Right Side Image"
            className="w-full md:w-[53%] h-auto mx-auto mt-10 md:mt-20"
          />
        </div>
      </div>

      {/* Ride Component */}
      <div className="py-12 px-6">
        {/* <Ride /> */}
      </div>

      {/* Next Banner */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-6">
          <img
            src="/images/IMG_2666.jpg"
            alt="Right Side Image"
            className="w-full md:w-[53%] h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 bg-yellow-400 text-white p-6 mb-9 flex justify-center items-center">
          <div className="text-center md:text-left mb-10 md:mb-[19%]">
            <h4 className="text-2xl font-bold mb-4">
              Flexibility at your fingertips, freedom awaits.
            </h4>
            <h1>
              Make money on your schedule with deliveries
              <br /> or rides—or both. You can use your own car or
              <br /> choose a rental through Go.
            </h1>
            <div className="flex flex-col md:flex-row items-center mt-9">
              <button className="bg-black h-9 mt-3 md:mt-0 rounded text-white w-28">
                Get Started
              </button>
              <a
                className="ml-0 md:ml-9 mt-3 md:mt-0 border-b-2 text-black border-black"
                href=""
              >
                Already have an account? Sign in --
                <span className="ml-1">&gt;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WhySafely */}
      <WhySafely />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;