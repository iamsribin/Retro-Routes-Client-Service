import { ChangeEvent } from 'react';
import { FormikProps } from 'formik';
import { Input, InputGroup, InputLeftElement, Button, Text, VStack } from '@chakra-ui/react';
import { AtSignIcon, EmailIcon, PhoneIcon, LockIcon, SmallAddIcon } from '@chakra-ui/icons';
import { SignupFormValues } from '@/shared/utils/types';

interface SignupFieldsProps {
  formik: FormikProps<SignupFormValues>;
  userImageUrl: string | null;
  setUserImageUrl: (url: string | null) => void;
}

const SignupFields = ({ formik, userImageUrl, setUserImageUrl }: SignupFieldsProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('userImage', file);
      setUserImageUrl(URL.createObjectURL(file));
    } else {
      setUserImageUrl(null);
      formik.setFieldValue('userImage', null);
    }
  };

  const renderInput = (name: keyof Omit<SignupFormValues, 'userImage' | 'otp'>, placeholder: string, type: string, icon: JSX.Element) => (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        <Input
          type={type}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          borderColor={formik.touched[name] && formik.errors[name] ? 'red.400' : 'gray.200'}
        />
      </InputGroup>
      {formik.touched[name] && formik.errors[name] && <Text color="red.500" fontSize="xs">{formik.errors[name]}</Text>}
    </>
  );

  return (
    <div className="user-signup-form md:w-8/12 px-9 py-8 bg-white drop-shadow-xl">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={2} align="stretch">
          {renderInput('name', 'Full Name', 'text', <AtSignIcon color="gray.400" />)}
          {renderInput('email', 'Email Address', 'email', <EmailIcon color="gray.400" />)}
          {renderInput('mobile', 'Mobile Number', 'text', <PhoneIcon color="gray.400" />)}
          {renderInput('password', 'Password', 'password', <LockIcon color="gray.400" />)}
          {renderInput('re_password', 'Confirm Password', 'password', <LockIcon color="gray.400" />)}
          {renderInput('referred_code', 'Referral Code', 'text', <SmallAddIcon color="gray.400" />)}
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" fontWeight="bold" color="blue.800">Upload Your Profile Image</Text>
            <Input
              id="rcImage"
              type="file"
              name="rcImage"
              accept="image/*"
              onChange={handleFileChange}
              variant="unstyled"
              pt={1}
            />
            {formik.touched.userImage && formik.errors.userImage && <Text color="red.500" fontSize="xs">{formik.errors.userImage}</Text>}
          </VStack>
          <Button type="submit" w="full" bg="black" color="white" _hover={{ color: 'black', bg: 'white' }} mt={3}>Register Now</Button>
        </VStack>
      </form>
    </div>
  );
};

export default SignupFields;