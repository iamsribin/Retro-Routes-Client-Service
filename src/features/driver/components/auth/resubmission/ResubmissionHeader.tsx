import { lazy } from 'react';
const LazyPlayer = lazy(() => import('@lottiefiles/react-lottie-player').then(module => ({ default: module.Player })));

const ResubmissionHeader: React.FC = () => (
  <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 justify-around items-center mb-3 md:m-0">
    <div className="flex w-full justify-center pt-10 items-center">
      <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-4 md:text-5xl">Resubmit Required Details</h1>
    </div>
    <div className="hidden md:flex md:items-center justify-center" style={{ marginTop: '-30px' }}>
      <LazyPlayer
        autoplay
        loop
        src="https://lottie.host/4d9f98cb-2a44-4a20-b422-649992c60069/MTxuwxSyrs.json"
        style={{ height: '80%', width: '80%', background: 'transparent' }}
      />
    </div>
  </div>
);

export default ResubmissionHeader;