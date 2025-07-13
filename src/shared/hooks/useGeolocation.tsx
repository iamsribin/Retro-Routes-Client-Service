// import { useEffect, useState } from "react";

// export default function useGeolocation() {

//   interface Position{
//     latitude:number,
//     longitude: number
//   }

//   const [position, setPosition] = useState<Position>({
//     latitude: 0,
//     longitude: 0,
//   });

//   useEffect(() => {
//     const geo = navigator.geolocation;

//     function onSuccess(position:GeolocationPosition) {
//       setPosition({
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       });
//     }

//     function onError(error:GeolocationPositionError) {
//       console.error("Error retrieving geolocation:", error);
//     }

//     const watcher = geo.watchPosition(onSuccess, onError);

//     return () => geo.clearWatch(watcher);
//   }, []);

//   return position;
// }