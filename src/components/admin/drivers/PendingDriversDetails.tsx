// components/admin/users/PendingDriverDetails.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { useDispatch } from 'react-redux';

interface Driver {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  driverImage?: string;
  joiningDate: string;
  aadhar: { aadharId: string; aadharImage: string };
  license: { licenseId: string; licenseImage: string };
  vehicle_details: { registerationID: string; model: string; rcImageUrl: string; carImageUrl: string };
}

interface PendingDriverDetailsProps {
  driver: Driver;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PendingDriverDetails: React.FC<PendingDriverDetailsProps> = ({ driver, isOpen, onClose, onUpdate }) => {
  const [rejectionReason, setRejectionReason] = React.useState('');
  const dispatch = useDispatch();

  const handleVerify = async (status: 'accepted' | 'rejected') => {
    try {
      const payload = {
        driverId: driver._id,
        status,
        ...(status === 'rejected' && { rejectionReason }),
      };

      await axiosAdmin(dispatch).post('/verifyDriver', payload);
      toast.success(`Driver ${status} successfully`);
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${status} driver: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Driver Verification - {driver.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Driver Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {driver.driverImage ? (
                <img src={driver.driverImage} alt={driver.name} className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl">{driver.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{driver.name}</h3>
                <p className="text-sm text-gray-600">{driver.email}</p>
                <p className="text-sm text-gray-600">{driver.mobile}</p>
              </div>
            </div>
            <div>
              <Label>Joining Date</Label>
              <p>{new Date(driver.joiningDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            {/* Aadhar */}
            <div>
              <Label>Aadhar Details</Label>
              <p>Aadhar ID: {driver.aadhar.aadharId}</p>
              <a href={driver.aadhar.aadharImage} target="_blank" className="text-blue-600 hover:underline">
                View Aadhar Image
              </a>
            </div>

            {/* License */}
            <div>
              <Label>License Details</Label>
              <p>License ID: {driver.license.licenseId}</p>
              <a href={driver.license.licenseImage} target="_blank" className="text-blue-600 hover:underline">
                View License Image
              </a>
            </div>

            {/* Vehicle */}
            <div>
              <Label>Vehicle Details</Label>
              <p>Registration ID: {driver.vehicle_details.registerationID}</p>
              <p>Model: {driver.vehicle_details.model}</p>
              <div className="flex gap-2">
                <a href={driver.vehicle_details.rcImageUrl} target="_blank" className="text-blue-600 hover:underline">
                  View RC
                </a>
                <a href={driver.vehicle_details.carImageUrl} target="_blank" className="text-blue-600 hover:underline">
                  View Vehicle
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Reason */}
        <div className="space-y-2">
          <Label>Rejection Reason (Required if rejecting)</Label>
          <Input
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection (if applicable)"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerify('rejected')}
            disabled={rejectionReason.trim() === ''}
          >
            Reject
          </Button>
          <Button onClick={() => handleVerify('accepted')}>
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default PendingDriverDetails