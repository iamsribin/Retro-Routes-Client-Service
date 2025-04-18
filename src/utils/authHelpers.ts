import { toast } from 'sonner';
import axiosUser from '@/services/axios/userAxios';
import { CheckUserParams } from './types';

export const checkUser = async ({ email, mobile, dispatch, navigate, setOtpPage }: CheckUserParams) => {
  try {
    const { data } = await axiosUser(dispatch).post('/checkUser', { email, mobile });
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