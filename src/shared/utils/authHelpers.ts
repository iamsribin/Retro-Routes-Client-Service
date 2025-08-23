import { toast } from 'sonner';
import {userAxios} from '@/shared/services/axios/axiosInstance';

export const checkUser = async ({name, email, mobile, navigate, setOtpPage }: any) => {
  try {
    const { data } = await userAxios.post('/checkUser', {name, email, mobile });
    if (data.message === 'user already have an account !') {
      toast.info('User already registered. Please login to continue');
      navigate('/login');
    } else {
      toast.success('Please check your OTP');
      setOtpPage(true);
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    throw error;
  }
};