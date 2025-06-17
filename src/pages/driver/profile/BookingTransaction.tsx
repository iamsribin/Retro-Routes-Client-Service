import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Select, 
  Input, 
  Flex, 
  Text, 
  Spinner, 
  Alert, 
  AlertIcon,
  HStack,
} from '@chakra-ui/react';
import { format, subDays } from 'date-fns';
import driverAxios from "@/services/axios/driverAxios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/services/redux/store";
import { Calendar } from 'lucide-react';

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
  distance?: string;
  price?: number;
  date: Date;
  status: 'Pending' | 'Accepted' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentMode?: string;
}

const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();
  const { driver } = useSelector((state: RootState) => ({
    driver: state.driver,
  }));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await driverAxios(dispatch).get(`/getBookingHistory`);
        console.log("909009",response.data);
        
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [dispatch, driver.driverId]);

  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
      });
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate, bookings]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (bookingId: string) => {
    navigate(`/driver/bookings/${bookingId}`);
  };

  return (
    <Box p={6} maxW="container.xl" mx="auto">
      <Text fontSize="2xl" mb={4} fontWeight="bold" display="flex" alignItems="center">
        <Calendar className="mr-2" /> Booking List
      </Text>

      <Flex mb={6} wrap="wrap" gap={4}>
        <Box flex="1" minW="200px">
          <Text mb={2}>Filter by Status</Text>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Confirmed">Confirmed</option>
          </Select>
        </Box>
        <Box flex="1" minW="200px">
          <Text mb={2}>Start Date</Text>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Box>
        <Box flex="1" minW="200px">
          <Text mb={2}>End Date</Text>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      </Flex>

      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Pickup</Th>
                  <Th>Dropoff</Th>
                  <Th>Distance</Th>
                  <Th>Price</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  {/* <Th>Payment</Th> */}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentBookings.map((booking) => (
                  <Tr key={booking._id}>
                    <Td>{booking.pickupLocation}</Td>
                    <Td>{booking.dropoffLocation}</Td>
                    <Td>{booking.distance || 'N/A'}</Td>
                    <Td>${booking.price?.toFixed(2) || 'N/A'}</Td>
                    <Td>{format(new Date(booking.date), 'PPp')}</Td>
                    <Td>{booking.status}</Td>
                    {/* <Td>{booking.paymentMode || 'N/A'}</Td> */}
                    <Td>
                      <Button size="sm" colorScheme="blue" onClick={() => handleView(booking._id)}>
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <HStack mt={4} justify="center" spacing={2}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                colorScheme={currentPage === page ? 'blue' : 'gray'}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default BookingList;