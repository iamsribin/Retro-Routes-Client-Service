import { useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Box } from '@chakra-ui/react';
import { signupValidation } from '@/shared/utils/validation';
import { SignupFormProps, SignupFormValues } from './type';
import { checkUser } from '@/shared/utils/authHelpers';
import LoadingSpinner from '@/shared/components/loaders/LoadingSpinner';
import SignupFields from "./SignupFields"

const OtpForm = lazy(() => import('@/shared/components/forms/OtpForm'));

const SignupForm = ({ otpPage, setOtpPage, counter, setCounter, otp, setOtp, userImageUrl, setUserImageUrl }: SignupFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => { setOtpPage(false); }, [setOtpPage]);

  useEffect(() => {
    if (otpPage && counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter, otpPage, setCounter]);

  const formik = useFormik<SignupFormValues>({
    initialValues: { name: '', email: '', mobile: '', password: '', re_password: '', referred_code: '', userImage: null, otp: '' },
    validationSchema: signupValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await checkUser({name:values.name, email: values.email, mobile: values.mobile, dispatch, navigate, setOtpPage });
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box className={otpPage ? 'flex md:w-1/2 justify-center px-4 pb-10 md:py-10 items-center' : 'flex md:w-1/2 justify-center pb-10 md:py-10 items-center'}>
      {otpPage ? (
        <Suspense fallback={<LoadingSpinner />}>
          <OtpForm counter={counter} setCounter={setCounter} otp={otp} setOtp={setOtp} formik={formik} />
        </Suspense>
      ) : (
        <SignupFields formik={formik} userImageUrl={userImageUrl} setUserImageUrl={setUserImageUrl} />
      )}
    </Box>
  );
};

export default SignupForm;