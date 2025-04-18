 
import { Input } from "@material-tailwind/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { Player } from "@lottiefiles/react-lottie-player";

function Ride() {
  const [noDriversModal, setNoDriversModal] = useState(false);
  const [center, setCenter] = useState({ lat: 13.003371, lng: 77.589134 });
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [zoom, setZoom] = useState(9);

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });


  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {noDriversModal && (
        <div x-data={{ isOpen: true }} className="relative flex justify-center">
          <div
            className="fixed inset-0 z-10 overflow-y-auto bg-opacity-50 bg-black"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-righ  sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                <div>
                  <div className="mt-2 text-center">
                    <h1 className="text-xl font-bold mb-2">Taking longer than usual!</h1>
                    <h1 className="my-2 text-sm">Dont worry, we got you!<br /> We're trying our best to get you a driver.</h1>

                    <div className="flex h-20 w-full items-center justify-center">
                      <Player
                        autoplay
                        loop
                        src="https://lottie.host/6d218af1-a90d-49b2-b56e-7ba126e3ac68/mNvXamDXCm.json"
                        style={{ height: '80%', width: '80%', background: "transparent" }}
                      />
                    </div>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      All the drivers seems busy. But if you ready to wait little more, we can get you the best driver available
                    </p>
                  </div>
                </div>

                <div className="mt-5 sm:flex sm:items-center sm:justify-center">
                  <div className="sm:flex sm:items-center ">
                    <button
                      onClick={() => setNoDriversModal(false)}
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-black border border-black hover:bg-black hover:text-white capitalize transition-colors duration-300 transform rounded-md sm:w-auto sm:mt-0 focus:outline-none "
                    >
                      CANCEL SEARCHING
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-blue-800">Book a Safe Ride!</h1>
        </div>

        <div className="container w-full md:flex md:items-start md:gap-10 grid grid-rows-2 gap-5 py-6">
          <div className="md:w-1/3 w-full mt-3 bg-white shadow-lg rounded-lg p-6">
            <div className="grid gap-8">
              <div className="w-full flex gap-4 items-end">
                <div className="w-4/5">
                  <Autocomplete>
                    <input
                      type="text"
                      ref={originRef}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Where from?"
                    />
                  </Autocomplete>
                </div>
                <div className="tooltip" data-tip="Choose your current location">
                  <button className="bg-black px-5 py-1.5 rounded-lg hover:bg-gray-800 transition duration-300">
                    <GpsFixedIcon className="text-white" />
                  </button>
                </div>
              </div>
              <div className="w-full flex gap-4 items-end">
                <div className="w-4/5">
                  <Autocomplete>
                    <input
                      type="text"
                      ref={destinationRef}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Where to?"
                    />
                  </Autocomplete>
                </div>
                <div className="tooltip" data-tip="Choose your current location">
                  <button className="bg-black px-5 py-1.5 rounded-lg hover:bg-gray-800 transition duration-300">
                    <GpsFixedIcon className="text-white" />
                  </button>
                </div>
              </div>
              <div className="w-full flex gap-2">
                <button className="w-3/5 h-10 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300">
                  SEARCH FOR CABS
                </button>
                <button className="w-2/5 h-10 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300">
                  CLEAR
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 w-full md:h-[32rem] h-auto">
            <GoogleMap
              center={center}
              zoom={zoom}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                borderRadius: "4%",
              }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map as google.maps.Map)}
            >
              <Marker position={center} />
            </GoogleMap>
          </div>
        </div>
      </div>
    </>
  );
}

export default Ride;