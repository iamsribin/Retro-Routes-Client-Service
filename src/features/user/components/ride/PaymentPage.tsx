// frontend/src/components/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar } from '@/shared/components/ui/avatar';
import { useToast } from '@/shared/components/ui/use-toast';
import { setPaymentStatus, hideRideMap } from '@/shared/services/redux/slices/rideSlice';
import { CreditCard, Wallet, Banknote, MapPin, Clock, Route, Star, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { RootState } from '@/shared/services/redux/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { postData } from '@/shared/services/api/api-service';
import { ResponseCom } from '@/shared/types/commonTypes';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: React.FC<{ bookingId: string; userId: string; driverId: string; amount: number }> = ({
  bookingId,
  userId,
  driverId,
  amount,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    dispatch(setPaymentStatus('pending'));
    try {
      const data  = await postData<ResponseCom["data"]>('/payments/create-checkout-session',"User", {
        bookingId,
        userId,
        driverId,
        amount,
      });

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) {
        dispatch(setPaymentStatus('failed'));
        toast({ title: 'Payment Failed', description: result.error.message, variant: 'destructive' });
      }
    } catch (error) {
      dispatch(setPaymentStatus('failed'));
      toast({ title: 'Payment Failed', description: (error as any).message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded" />
      <Button type="submit" disabled={!stripe || !elements} className="mt-2 w-full">
        Pay ₹{amount.toFixed(2)}
      </Button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { paymentStatus, rideData } = useSelector((state: RootState) => state.RideMap);
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!rideData) {
      navigate('/');
    }
  }, [rideData, navigate]);

  const paymentMethods = [
    {
      id: 'wallet',
      name: 'Wallet',
      icon: Wallet,
      description: 'Pay using your wallet balance',
      color: 'bg-blue-500',
      available: true,
    },
    {
      id: 'cash',
      name: 'Cash in Hand',
      icon: Banknote,
      description: 'Pay with cash to the driver',
      color: 'bg-green-500',
      available: true,
    },
    {
      id: 'stripe',
      name: 'Online Payment',
      icon: CreditCard,
      description: 'Pay with card via Stripe',
      color: 'bg-purple-500',
      available: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({ title: 'Select Payment Method', description: 'Please select a payment method to proceed', variant: 'destructive' });
      return;
    }

    // setIsProcessing(true);
    // dispatch(setPaymentStatus('pending'));

    try {
      if (selectedPaymentMethod === 'cash') {
        // await axiosUser.post('/payments/cash-payment', {
        //   bookingId: rideData?.booking.ride_id,
        //   userId: rideData?.userDetails.user_id,
        //   driverId: rideData?.driverDetails.driverId,
        //   amount: rideData?.booking.price,
        // });
      } else if (selectedPaymentMethod === 'wallet') {
        // await axiosUser.post('/payments/wallet-payment', {
        //   bookingId: rideData?.booking.ride_id,
        //   userId: rideData?.userDetails.user_id,
        //   driverId: rideData?.driverDetails.driverId,
        //   amount: rideData?.booking.price,
        // });
      }
    } catch (error) {
      // dispatch(setPaymentStatus('failed'));
      toast({ title: 'Payment Failed', description: (error as any).message, variant: 'destructive' });
      // setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'completed':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'pending':
        return 'Processing payment...';
      default:
        return 'Complete your payment';
    }
  };

  if (!rideData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No ride data found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
            disabled={paymentStatus === 'completed'}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>
        </div>

        <Card className="p-4 mb-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <img
                src={rideData.driverDetails.driverImage || '/api/placeholder/48/48'}
                alt={rideData.driverDetails.driverName}
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{rideData.driverDetails.driverName}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{rideData.driverDetails.rating.toFixed(1)}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">{rideData.driverDetails.vehicleModel}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pickup</p>
                <p className="text-sm text-gray-600">{rideData.booking.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Drop-off</p>
                <p className="text-sm text-gray-600">{rideData.booking.dropoffLocation}</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{rideData.booking.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{rideData.booking.duration}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 mb-6 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                >
                  <div className={`w-10 h-10 rounded-full ${method.color} flex items-center justify-center mr-3`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedPaymentMethod === method.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </div>
              );
            })}
          </div>
          {selectedPaymentMethod === 'stripe' && (
            <div className="mt-4">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  bookingId={rideData.booking.ride_id}
                  userId={rideData.userDetails.user_id}
                  driverId={rideData.driverDetails.driverId}
                  amount={rideData.booking.price}
                />
              </Elements>
            </div>
          )}
        </Card>

        <Card className="p-4 mb-6 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium">₹{(rideData.booking.price * 0.7).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance Charge</span>
              <span className="font-medium">₹{(rideData.booking.price * 0.25).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">₹{(rideData.booking.price * 0.05).toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-blue-600">₹{rideData.booking.price.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Button
          onClick={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing || paymentStatus === 'completed' || selectedPaymentMethod === 'stripe'}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : paymentStatus === 'completed' ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Payment Completed
            </div>
          ) : (
            `Pay ₹${rideData.booking.price.toFixed(2)}`
          )}
        </Button>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 text-center">
            🔒 Your payment is secure and encrypted. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;