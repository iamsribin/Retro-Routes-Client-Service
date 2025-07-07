// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { MessageCircle, Phone, Clock, Car, MapPin, X, Star } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
// import { useJsApiLoader } from '@react-google-maps/api';
// import { hideRideMap } from '@/services/redux/slices/rideSlice';
// import { RootState } from '@/services/redux/store';

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Driver {
//   name: string;
//   rating: number;
//   phone: string;
//   vehicleNumber: string;
//   vehicleModel: string;
//   vehicleColor: string;
//   photo: string;
// }

// interface RideData {
//   ride_id: string;
//   pin: string;
//   driver: Driver;
//   estimatedArrival: string;
//   pickupAddress: string;
//   dropoffAddress: string;
// }

// interface RideState {
//   isOpen: boolean;
//   userPickupLocation: Coordinates | null;
//   driverLocation: Coordinates | null;
//   data: RideData | null;
// }

// const RideTrackingUI: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const rideData = useSelector((state: RootState) => state.RideMap);
//   const [timeLeft, setTimeLeft] = useState<number>(30);
//   const [canCancel, setCanCancel] = useState<boolean>(true);
//   const [driverArrivalTime, setDriverArrivalTime] = useState<number>(5);
//   const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
//     libraries: ['places'],
//   });

//   // Sample data for fallback
//   const sampleRideData: RideState = {
//     isOpen: true,
//     userPickupLocation: { latitude: 13.003371, longitude: 77.589134 },
//     driverLocation: { latitude: 13.013371, longitude: 77.599134 },
//     data: {
//       ride_id: 'RD123456789',
//       pin: '4587',
//       driver: {
//         name: 'Rajesh Kumar',
//         rating: 4.8,
//         phone: '+91 98765 43210',
//         vehicleNumber: 'KA 01 AB 1234',
//         vehicleModel: 'Maruti Swift',
//         vehicleColor: 'White',
//         photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
//       },
//       estimatedArrival: '5 mins',
//       pickupAddress: 'MG Road, Bangalore',
//       dropoffAddress: 'Electronic City, Bangalore',
//     },
//   };

//   // Use store data if isOpen is true and data is valid, otherwise use sample data
//   const currentRideData: RideState = sampleRideData;

//   useEffect(() => {
//     if (!currentRideData.isOpen) {
        
//       navigate('/');
//     }
//   }, [currentRideData.isOpen, navigate]);

//   // Handle cancellation timer and driver arrival countdown
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           setCanCancel(false);
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     const arrivalTimer = setInterval(() => {
//       setDriverArrivalTime((prev) => {
//         if (prev <= 1) {
//           clearInterval(arrivalTimer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 60000); 
//     return () => {
//       clearInterval(timer);
//       clearInterval(arrivalTimer);
//     };
//   }, []);

//   // Fetch route between driver and user pickup location
//   useEffect(() => {
//     const fetchDriverRoute = async () => {
//       if (
//         !isLoaded ||
//         !currentRideData.driverLocation ||
//         !currentRideData.userPickupLocation
//       ) {
//         return;
//       }

//       const directionsService = new google.maps.DirectionsService();

//       try {
//         const result = await directionsService.route({
//           origin: {
//             lat: currentRideData.driverLocation.latitude,
//             lng: currentRideData.driverLocation.longitude,
//           },
//           destination: {
//             lat: currentRideData.userPickupLocation.latitude,
//             lng: currentRideData.userPickupLocation.longitude,
//           },
//           travelMode: google.maps.TravelMode.DRIVING,
//         });

//         setDirections(result);
//       } catch (error) {
//         console.error('Driver route request failed:', error);
//       }
//     };

//     fetchDriverRoute();
//   }, [
//     isLoaded,
//     currentRideData.driverLocation,
//     currentRideData.userPickupLocation,
//   ]);

//   const handleCancelRide = () => {
//     console.log('Cancelling ride...');
//     dispatch(hideRideMap());
//   };

//   const handleCallDriver = () => {
//     if (currentRideData.data?.driver.phone) {
//       window.open(`tel:${currentRideData.data.driver.phone}`);
//     }
//   };

//   const handleMessageDriver = () => {
//     console.log('Opening chat with driver...');
//   };

//   // Render nothing if isOpen is false (navigation handled by useEffect)
//   if (!currentRideData.isOpen || !isLoaded) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//             <div>
//               <h1 className="text-lg font-semibold text-gray-900">Driver Found</h1>
//               <p className="text-sm text-gray-600">Arriving in {driverArrivalTime} minutes</p>
//             </div>
//           </div>
//           <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//             Ride ID: {currentRideData.data?.ride_id}
//           </Badge>
//         </div>
//       </div>

//       {/* Map Section */}
//       <div className="relative h-[45vh]">
//         <GoogleMap
//           center={{
//             lat: currentRideData.userPickupLocation?.latitude || 13.003371,
//             lng: currentRideData.userPickupLocation?.longitude || 77.589134,
//           }}
//           zoom={15}
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//         >
//           {/* User Location Marker */}
//           {currentRideData.userPickupLocation && (
//             <Marker
//               position={{
//                 lat: currentRideData.userPickupLocation.latitude,
//                 lng: currentRideData.userPickupLocation.longitude,
//               }}
//               label="You"
//             />
//           )}

//           {/* Driver Location Marker */}
//           {currentRideData.driverLocation && (
//             <Marker
//               position={{
//                 lat: currentRideData.driverLocation.latitude,
//                 lng: currentRideData.driverLocation.longitude,
//               }}
//               label="Driver"
//             />
//           )}

//           {/* Route */}
//           {directions && <DirectionsRenderer directions={directions} />}
//         </GoogleMap>

//         {/* ETA Card Overlay */}
//         <div className="absolute top-4 left-4 right-4">
//           <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <Car className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">Driver is on the way</p>
//                     <p className="text-sm text-gray-600">{currentRideData.data?.estimatedArrival} away</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-500">Pickup at</p>
//                   <p className="font-medium text-gray-900 text-sm">{currentRideData.data?.pickupAddress}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Driver Details Section */}
//       <div className="bg-white px-4 py-6">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="relative">
//             <img
//               src={currentRideData.data?.driver.photo}
//               alt={currentRideData.data?.driver.name}
//               className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//             />
//             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
//               <div className="w-2 h-2 bg-white rounded-full"></div>
//             </div>
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center space-x-2 mb-1">
//               <h3 className="text-lg font-semibold text-gray-900">{currentRideData.data?.driver.name}</h3>
//               <div className="flex items-center space-x-1">
//                 <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                 <span className="text-sm font-medium text-gray-700">{currentRideData.data?.driver.rating}</span>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600">{currentRideData.data?.driver.vehicleModel} • {currentRideData.data?.driver.vehicleColor}</p>
//             <p className="text-sm font-medium text-gray-900">{currentRideData.data?.driver.vehicleNumber}</p>
//           </div>

//           <div className="flex space-x-3">
//             <Button
//               size="sm"
//               variant="outline"
//               className="w-12 h-12 rounded-full p-0 border-gray-300"
//               onClick={handleMessageDriver}
//             >
//               <MessageCircle className="w-5 h-5 text-gray-600" />
//             </Button>
//             <Button
//               size="sm"
//               className="w-12 h-12 rounded-full p-0 bg-green-500 hover:bg-green-600"
//               onClick={handleCallDriver}
//             >
//               <Phone className="w-5 h-5 text-white" />
//             </Button>
//           </div>
//         </div>

//         {/* PIN Section */}
//         <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//           <CardContent className="p-4">
//             <div className="text-center">
//               <div className="mb-2">
//                 <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
//                 <p className="text-sm font-medium text-gray-700">Your Ride PIN</p>
//               </div>
//               <div className="text-3xl font-bold text-blue-700 tracking-wider mb-2">
//                 {currentRideData.data?.pin}
//               </div>
//               <p className="text-xs text-gray-600">Share this PIN with your driver to start the ride</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Trip Details */}
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <h4 className="font-semibold text-gray-900 mb-3">Trip Details</h4>
//             <div className="space-y-3">
//               <div className="flex items-start space-x-3">
//                 <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-500">Pickup</p>
//                   <p className="font-medium text-gray-900">{currentRideData.data?.pickupAddress}</p>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-500">Dropoff</p>
//                   <p className="font-medium text-gray-900">{currentRideData.data?.dropoffAddress}</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Cancel Button with Timer */}
//         {canCancel && (
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Clock className="w-5 h-5 text-red-600" />
//                   <div>
//                     <p className="font-medium text-red-900">Cancel ride</p>
//                     <p className="text-sm text-red-600">Available for {timeLeft} seconds</p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={handleCancelRide}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   <X className="w-4 h-4 mr-1" />
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RideTrackingUI;