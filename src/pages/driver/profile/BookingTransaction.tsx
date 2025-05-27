import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Text, 
  VStack, 
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import axios from 'axios';
import { format } from 'date-fns';
import driverAxios from "@/services/axios/driverAxios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/services/redux/store";


// Sample data for UI rendering
// const sampleBookings = [
//   {
//     _id: '1',
//     ride_id: 'RIDE001',
//     user_id: 'USER001',
//     userName: 'John Doe',
//     pickupCoordinates: { latitude: 40.7128, longitude: -74.0060 },
//     dropoffCoordinates: { latitude: 40.7589, longitude: -73.9851 },
//     pickupLocation: '123 Main St, NYC',
//     dropoffLocation: '456 Park Ave, NYC',
//     driver_id: 'DRIVER001',
//     driverCoordinates: { latitude: 40.7300, longitude: -73.9950 },
//     distance: '5.2 km',
//     duration: '15 min',
//     vehicleModel: 'Toyota Camry',
//     price: 25.50,
//     date: new Date('2025-05-27T10:00:00Z'),
//     status: 'Confirmed',
//     pin: 1234,
//     paymentMode: 'Credit Card',
//     feedback: 'Great ride!',
//     rating: 4.5
//   },
//   {
//     _id: '2',
//     ride_id: 'RIDE002',
//     user_id: 'USER002',
//     userName: 'Jane Smith',
//     pickupCoordinates: { latitude: 40.7306, longitude: -73.9352 },
//     dropoffCoordinates: { latitude: 40.7549, longitude: -73.9840 },
//     pickupLocation: '789 Broadway, NYC',
//     dropoffLocation: '101 Times Sq, NYC',
//     driver_id: null,
//     driverCoordinates: null,
//     distance: '3.8 km',
//     duration: '10 min',
//     vehicleModel: 'Honda Accord',
//     price: 18.75,
//     date: new Date('2025-05-27T12:00:00Z'),
//     status: 'Pending',
//     pin: null,
//     paymentMode: 'Cash',
//     feedback: null,
//     rating: null
//   }
// ];

interface Booking {
  _id: string;
  ride_id: string;
  user_id: string;
  userName: string;
  pickupCoordinates: { latitude: number; longitude: number };
  dropoffCoordinates: { latitude: number; longitude: number };
  pickupLocation: string;
  dropoffLocation: string;
  driver_id?: string;
  driverCoordinates?: { latitude: number; longitude: number };
  distance?: string;
  duration?: string;
  vehicleModel: string;
  price?: number;
  date: Date;
  status: 'Pending' | 'Accepted' | 'Confirmed' | 'Completed' | 'Cancelled';
  pin?: number;
  paymentMode?: string;
  feedback?: string;
  rating?: number;
}

const BookingList: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

  const { driver } = useSelector((state: RootState) => ({
    driver: state.driver,
  }));
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await driverAxios(dispatch).get(`/getBookingHistory/${driver.driverId}`);
        
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  

  // Using sample data instead
  // useEffect(() => {
  //   setBookings(sampleBookings);
  //   setLoading(false);
  // }, []);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    onOpen();
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">Booking List</Text>

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Ride ID</Th>
              <Th>User</Th>
              <Th>Pickup</Th>
              <Th>Dropoff</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking._id}>
                <Td>{booking.ride_id}</Td>
                <Td>{booking.userName}</Td>
                <Td>{booking.pickupLocation}</Td>
                <Td>{booking.dropoffLocation}</Td>
                <Td>{booking.status}</Td>
                <Td>{format(new Date(booking.date), 'PPp')}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" onClick={() => handleView(booking)}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {selectedBooking && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Booking Details - {selectedBooking.ride_id}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="start" spacing={4}>
                <Text><strong>User:</strong> {selectedBooking.userName} (ID: {selectedBooking.user_id})</Text>
                <Text><strong>Pickup Location:</strong> {selectedBooking.pickupLocation}</Text>
                <Text>
                  <strong>Pickup Coordinates:</strong> 
                  Lat: {selectedBooking.pickupCoordinates.latitude}, 
                  Lon: {selectedBooking.pickupCoordinates.longitude}
                </Text>
                <Text><strong>Dropoff Location:</strong> {selectedBooking.dropoffLocation}</Text>
                <Text>
                  <strong>Dropoff Coordinates:</strong> 
                  Lat: {selectedBooking.dropoffCoordinates.latitude}, 
                  Lon: {selectedBooking.dropoffCoordinates.longitude}
                </Text>
                {selectedBooking.driver_id && (
                  <Text><strong>Driver ID:</strong> {selectedBooking.driver_id}</Text>
                )}
                {selectedBooking.driverCoordinates && (
                  <Text>
                    <strong>Driver Coordinates:</strong> 
                    Lat: {selectedBooking.driverCoordinates.latitude}, 
                    Lon: {selectedBooking.driverCoordinates.longitude}
                  </Text>
                )}
                <Text><strong>Distance:</strong> {selectedBooking.distance || 'N/A'}</Text>
                <Text><strong>Duration:</strong> {selectedBooking.duration || 'N/A'}</Text>
                <Text><strong>Vehicle Model:</strong> {selectedBooking.vehicleModel}</Text>
                <Text><strong>Price:</strong> ${selectedBooking.price?.toFixed(2) || 'N/A'}</Text>
                <Text><strong>Date:</strong> {format(new Date(selectedBooking.date), 'PPp')}</Text>
                <Text><strong>Status:</strong> {selectedBooking.status}</Text>
                {selectedBooking.pin && (
                  <Text><strong>Pin:</strong> {selectedBooking.pin}</Text>
                )}
                <Text><strong>Payment Mode:</strong> {selectedBooking.paymentMode || 'N/A'}</Text>
                {selectedBooking.feedback && (
                  <Text><strong>Feedback:</strong> {selectedBooking.feedback}</Text>
                )}
                {selectedBooking.rating && (
                  <Text><strong>Rating:</strong> {selectedBooking.rating}/5</Text>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default BookingList;