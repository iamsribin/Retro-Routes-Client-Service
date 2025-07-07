import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Player } from '@lottiefiles/react-lottie-player';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ open, onOpenChange, type, title, message }) => {
  const animationUrls = {
    success: 'https://lottie.host/8f3e4b7e-0c7e-4b1e-9f5a-3c8b3e5c7890/LpQ4r7q1Yk.json', // Car arriving animation
    error: 'https://lottie.host/7c3e4b7e-0c7e-4b1e-9f5a-3c8b3e5c3456/NoDriver.json',   // No driver found animation
    info: 'https://lottie.host/3d3e4b7e-0c7e-4b1e-9f5a-3c8b3e5c9012/SearchCar.json'    // Searching for car animation
  };

  const styles = {
    success: {
      bgClass: 'bg-green-50 border-green-500',
      titleClass: 'text-green-800',
      messageClass: 'text-green-700'
    },
    error: {
      bgClass: 'bg-red-50 border-red-500',
      titleClass: 'text-red-800',
      messageClass: 'text-red-700'
    },
    info: {
      bgClass: 'bg-blue-50 border-blue-500',
      titleClass: 'text-blue-800',
      messageClass: 'text-blue-700'
    }
  };

  const { bgClass, titleClass, messageClass } = styles[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`border-2 ${bgClass} rounded-xl max-w-md`}>
        <DialogHeader className="flex items-center justify-center">
          <Player
            autoplay
            loop={false}
            src={animationUrls[type]}
            style={{ height: '100px', width: '100px' }}
          />
          <DialogTitle className={`text-xl font-bold ${titleClass}`}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className={`text-center ${messageClass}`}>
          {message}
        </div>
        <DialogFooter className="mt-4 flex justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            className={`px-6 py-2 rounded-lg font-medium
              ${type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;