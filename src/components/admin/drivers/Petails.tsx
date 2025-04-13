import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ArrowLeft, Unlock, Lock, ZoomIn } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDispatch } from 'react-redux';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Driver {
  _id: string;
  name: string;
  email: string;  
  mobile: string;
  driverImage?: string;
  aadhar?: { aadharId: string; aadharFrontImageUrl: string; aadharBackImageUrl: string };
  license?: { licenseId: string; licenseFrontImageUrl: string; licenseBackImageUrl: string; licenseValidity: string };
  vehicle_details?: { 
    registerationID: string; 
    model: string; 
    rcFrondImageUrl: string;
    rcBackImageUrl: string;
    carFrondImageUrl: string;
    carBackImageUrl: string;
  };
  joiningDate: string;
  account_status: "Good" | "Block" | "Pending";
  location?: { longitude: number; latitude: number };
}

const PendingDriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const { data } = await axiosAdmin(dispatch).get(`/driverDetails/${id}`);
        console.log("-------------",data);
        
        setDriver(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch driver details');
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [id, dispatch]);

  const handleVerification = async (status: "Verified" | "Rejected" | "Good" | "Block") => {
    if (!note) {
      toast.error("Please provide a note");
      return;
    }
    try {
      await axiosAdmin(dispatch).post(`/driver/verify/${id}`, { status, note });
      toast.success(`Driver ${status} successfully`);
      navigate('/admin/drivers');
    } catch (error) {
      toast.error(`Failed to ${status} driver`);
    }
  };

  if (loading) return <AdminLayout><div className="flex justify-center items-center h-screen text-white">Loading...</div></AdminLayout>;
  if (!driver) return <AdminLayout><div className="flex justify-center items-center h-screen text-white">Driver not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-gray-300 hover:bg-gray-700"
          onClick={() => navigate('/admin/drivers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Drivers
        </Button>

        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h1 className="text-3xl font-bold">{driver.name}</h1>
              <p className="text-indigo-200">Driver ID: {driver._id}</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="details" className="data-[state=active]:bg-indigo-600">Driver Details</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-indigo-600">Documents</TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-indigo-600">Location Map</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-700 border-none">
                    <CardHeader>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {driver.driverImage && (
                        <img src={driver.driverImage} alt={driver.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
                      )}
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p>{driver.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Mobile</p>
                        <p>{driver.mobile}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Joining Date</p>
                        <p>{new Date(driver.joiningDate).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-none md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {driver.account_status === 'Pending' ? 'Verification Actions' : 'Manage Driver'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder={driver.account_status === 'Pending' ? 'Add a verification note' : 'Add a reason for action'}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                      {driver.account_status === 'Pending' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVerification('Verified')}>
                            <Check className="mr-2 h-4 w-4" /> Accept
                          </Button>
                          <Button variant="destructive" onClick={() => handleVerification('Rejected')}>
                            <X className="mr-2 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className={driver.account_status === 'Good' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                          onClick={() => handleVerification(driver.account_status === 'Good' ? 'Block' : 'Good')}
                        >
                          {driver.account_status === 'Good' ? (
                            <><Lock className="mr-2 h-4 w-4" /> Block Driver</>
                          ) : (
                            <><Unlock className="mr-2 h-4 w-4" /> Unblock Driver</>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Aadhar Card', id: driver.aadhar?.aadharId, front: driver.aadhar?.aadharFrontImageUrl, back: driver.aadhar?.aadharBackImageUrl },
                    { title: 'Driving License', id: driver.license?.licenseId, front: driver.license?.licenseFrontImageUrl, back: driver.license?.licenseBackImageUrl },
                    { title: 'Vehicle RC', id: driver.vehicle_details?.registerationID, front: driver.vehicle_details?.rcFrondImageUrl, back: driver.vehicle_details?.rcBackImageUrl },
                    { title: 'Vehicle Image', id: driver.vehicle_details?.model, front: driver.vehicle_details?.carFrondImageUrl, back: driver.vehicle_details?.carBackImageUrl },
                  ].map((doc) => (
                    <Card key={doc.title} className="bg-gray-700 border-none">
                      <CardHeader>
                        <CardTitle className="text-white">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-400">ID: {doc.id || 'Not provided'}</p>
                        <div className="space-y-2">
                          {doc.front && (
                            <div className="relative group">
                              <img src={doc.front} alt={`${doc.title} front`} className="w-full h-40 object-cover rounded-md" />
                              <Button
                                variant="ghost"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setSelectedImage(doc.front)}
                              >
                                <ZoomIn className="h-5 w-5 text-white" />
                              </Button>
                            </div>
                          )}
                          {doc.back && (
                            <div className="relative group">
                              <img src={doc.back} alt={`${doc.title} back`} className="w-full h-40 object-cover rounded-md" />
                              <Button
                                variant="ghost"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setSelectedImage(doc.back)}
                              >
                                <ZoomIn className="h-5 w-5 text-white" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map" className="p-6">
                <Card className="bg-gray-700 border-none">
                  <CardHeader>
                    <CardTitle className="text-white">Driver Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {driver.location ? (
                      // You would need to integrate a map library like react-leaflet or google-maps-react here
                      <div className="h-96 bg-gray-600 rounded-md flex items-center justify-center">
                        Map implementation would go here (lat: {driver.location.latitude}, lng: {driver.location.longitude})
                      </div>
                    ) : (
                      <div className="h-96 bg-gray-600 rounded-md flex items-center justify-center text-gray-400">
                        Location data not available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(undefined)}>
        <DialogContent className="max-w-4xl bg-gray-800 border-none">
          {selectedImage && (
            <img src={selectedImage} alt="Zoomed document" className="w-full h-auto rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingDriverDetails;