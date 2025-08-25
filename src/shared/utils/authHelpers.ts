import { toast } from 'sonner';
import ApiEndpoints from '@/constants/api-end-pointes';
import { postData } from '../services/api/api-service';
import { ResponseCom } from '../types/commonTypes';

export const checkUser = async ({name, email, mobile, navigate, setOtpPage }: any) => {
  try {
    const  data  = await postData<ResponseCom["data"]>(ApiEndpoints.CHECK_USER,"User", {name, email, mobile });
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