import { MouseEvent } from 'react';
import { FormikProps } from 'formik';
import { Button, Text, HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { toast } from 'sonner';
import axiosUser from '@/services/axios/userAxios';
import ApiEndpoints from '@/constants/api-end-points';
import { SignupFormValues } from '@/utils/types';
import { useDispatch } from 'react-redux';

interface OtpFormProps {
  counter: number;
  setCounter: (value: number) => void;
  otp: number;
  setOtp: (value: number) => void;
  formik: FormikProps<SignupFormValues>;
}

const OtpForm = ({ counter, setCounter, otp, setOtp, formik }: OtpFormProps) => {
  const dispatch = useDispatch();
  const handleOtpChange = (index: number, newValue: string) => {
    const parsedValue = parseInt(newValue) || 0;
    const newOtp = [...otp.toString().padStart(6, '0')];
    newOtp[index] = parsedValue.toString();
    setOtp(parseInt(newOtp.join('')) || 0);
  };

  const handleSignupSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (counter <= 0) {
      toast.error('Time expired, tap to resend');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', formik.values.name);
      formData.append('email', formik.values.email);
      formData.append('mobile', formik.values.mobile);
      formData.append('password', formik.values.password);
      formData.append('re_password', formik.values.re_password);
      formData.append('referred_code', formik.values.referred_code);
      formData.append('otp', otp.toString());
      if (formik.values.userImage) formData.append('userImage', formik.values.userImage);

      const { data } = await axiosUser(dispatch).post(ApiEndpoints.USER_REGISTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.message === 'Success') {
        toast.success('OTP verified successfully');
        toast.success('Account created successfully');
        window.location.href = '/login';
      } else if (data.message === 'Invalid OTP') {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const resendOtp = async () => {
    try {
      const { data } = await axiosUser(dispatch).post(ApiEndpoints.RESENT_OTP, formik.values);
      if (data.message === 'OTP resent successfully') toast.success(data.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="user-otp-form md:w-10/12 px-9 py-10 bg-white drop-shadow-2xl">
      <form>
        <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={5} color="gray.800">Enter the OTP sent to your email</Text>
        <HStack justify="center" mb={4}>
          <PinInput size="sm" otp placeholder="">
            {[...Array(6)].map((_, index) => (
              <PinInputField key={index} onChange={(e) => handleOtpChange(index, e.target.value)} />
            ))}
          </PinInput>
        </HStack>
        <Button onClick={handleSignupSubmit} type="submit" w="full" colorScheme="blue" mt={4} mb={2}>Verify</Button>
        <Text textAlign="center" fontSize="sm" color="gray.500" mt={4}>
          {counter > 0 ? `Resend OTP in 00:${counter}` : (
            <Text as="span" color="blue.800" cursor="pointer" onClick={() => { setCounter(40); setOtp(0); resendOtp(); }}>Resend OTP</Text>
          )}
        </Text>
      </form>
    </div>
  );
};

export default OtpForm;