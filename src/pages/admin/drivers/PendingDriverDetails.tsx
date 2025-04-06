import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowLeft, Unlock, Lock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDispatch } from 'react-redux';
import { Textarea } from '@/components/ui/textarea'; 

interface Driver {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  driverImage?: string;
  aadhar?: { aadharId: string; aadharImage: string };
  license?: { licenseId: string; licenseImage: string };
  vehicle_details?: { 
    registerationID: string; 
    model: string; 
    rcImageUrl: string; 
    carImageUrl: string 
  };
  joiningDate: string;
  account_status: "Good" | "Block" | "Pending"
}

const PendingDriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string>(''); 

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const { data } = await axiosAdmin(dispatch).get(`/driverDetails/${id}`);
        console.log("====data=====", data);
        setDriver(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch driver details');
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [id, dispatch]);

  const handleVerification = async (status: "Verified" | "Rejected"| "Good"| "Block") => {
    try {

    if(!note){
        toast.error("give note");
         return   
    }

      // Send verification status and note to the backend
       const response =  await axiosAdmin(dispatch).post(`/driver/verify/${id}`, {
         status, 
         note,
        });
        console.log(response);
      toast.success(`Driver ${status} successfully`);

      navigate('/admin/drivers');

    } catch (error) {
        console.log(error);
        
      toast.error(`Failed to ${status} driver`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  if (!driver) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          Driver not found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/admin/drivers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Drivers
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Driver Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {driver.driverImage && (
                    <img
                      src={driver.driverImage}
                      alt={driver.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{driver.name}</h2>
                    <p className="text-gray-600">{driver.email}</p>
                    <p className="text-gray-600">{driver.mobile}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p>{new Date(driver.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {driver.account_status === 'Pending' ? 'Verification Actions' : 'Manage Driver'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder={
                    driver.account_status === 'Pending'
                      ? 'Add a note'
                      : 'Add a reason for block/unblock'
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full"
                />
                {driver.account_status === 'Pending' ? (
                  <>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerification('Verified')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept Driver
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleVerification('Rejected')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject Driver
                    </Button>
                  </>
                ) : (
                  <>
                    {driver.account_status === 'Good' ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleVerification('Block')}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Block Driver
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerification('Good')}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Unblock Driver
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Aadhar */}
                <div>
                  <h3 className="font-semibold mb-2">Aadhar Card</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ID: {driver.aadhar?.aadharId || 'Not provided'}
                  </p>
                  {driver.aadhar?.aadharImage ? (
                    <img
                      src={driver.aadhar.aadharImage}
                      alt="Aadhar"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Image not available</p>
                  )}
                </div>

                {/* License */}
                <div>
                  <h3 className="font-semibold mb-2">Driving License</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ID: {driver.license?.licenseId || 'Not provided'}
                  </p>
                  {driver.license?.licenseImage ? (
                    <a href={driver.license.licenseImage} >
                    <img
                      src={driver.license.licenseImage}
                      alt="License"
                      className="w-full h-40 object-cover rounded-md"
                    />
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Image not available</p>
                  )}
                </div>

                {/* RC */}
                <div>
                  <h3 className="font-semibold mb-2">Vehicle RC</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ID: {driver.vehicle_details?.registerationID || 'Not provided'}
                  </p>
                  {driver.vehicle_details?.rcImageUrl ? (
                    <img
                      src={driver.vehicle_details.rcImageUrl}
                      alt="RC"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Image not available</p>
                  )}
                </div>

                {/* Vehicle Image */}
                <div>
                  <h3 className="font-semibold mb-2">Vehicle Image</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Model: {driver.vehicle_details?.model || 'Not provided'}
                  </p>
                  {driver.vehicle_details?.carImageUrl ? (
                    <img
                      src={driver.vehicle_details.carImageUrl}
                      alt="Vehicle"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Image not available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingDriverDetails;