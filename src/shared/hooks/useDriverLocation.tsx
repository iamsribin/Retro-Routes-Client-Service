// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useSocket } from "@/context/socket-context";
// import { toast } from "sonner";
// import { Coordinates } from "@/shared/types/commonTypes";
// import { DriverRideRequest } from "../types/driver/ridetype";

// const useDriverLocation = (rideData: DriverRideRequest | null) => {
//   const dispatch = useDispatch();
//   const { socket, isConnected } = useSocket();
//   const [driverLocation, setDriverLocation] = useState<Coordinates | null>(null);

//   useEffect(() => {
//     let watchId: number;

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setDriverLocation({ latitude, longitude });
//           if (socket && isConnected && rideData) {
//             socket.emit("driverLocationUpdate", {
//               requestId: rideData.requestId,
//               location: { latitude, longitude },
//             });
//           }
//         },
//         (error) => {
//           console.error("Error getting initial location:", error);
//           setDriverLocation({ latitude: 9.9516447, longitude: 76.3100864 });
//           toast.error("Unable to get location. Using default coordinates.");
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
//       );

//       watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setDriverLocation({ latitude, longitude });
//           if (socket && isConnected && rideData) {
//             socket.emit("driverLocationUpdate", {
//               requestId: rideData.requestId,
//               location: { latitude, longitude },
//             });
//           }
//         },
//         (error) => {
//           console.error("Error watching location:", error);
//           toast.warning("Location update failed.");
//         },
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
//       );
//     } else {
//       setDriverLocation({ latitude: 9.9516447, longitude: 76.3100864 });
//       toast.error("Geolocation not supported by your browser.");
//     }

//     return () => {
//       if (watchId) {
//         navigator.geolocation.clearWatch(watchId);
//       }
//     };
//   }, [socket, isConnected, rideData, dispatch]);

//   return driverLocation;
// };

// export default useDriverLocation;