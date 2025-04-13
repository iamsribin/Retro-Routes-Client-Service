import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, ArrowLeft, Unlock, Lock, ZoomIn } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDispatch } from 'react-redux';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Fix Leaflet default icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface DriverInterface {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  driverImage: string;
  aadhar: {
    aadharId: string;
    aadharFrontImageUrl: string;
    aadharBackImageUrl: string;
  };
  license: {
    licenseId: string;
    licenseFrontImageUrl: string;
    licenseBackImageUrl: string;
    licenseValidity: string;
  };
  location: {
    longitude: string;
    latitude: string;
  };
  vehicle_details: {
    registerationID: string;
    model: string;
    rcFrondImageUrl: string;
    rcBackImageUrl: string;
    carFrondImageUrl: string;
    carBackImageUrl: string;
    rcStartDate: string;
    rcExpiryDate: string;
    insuranceImageUrl: string;
    insuranceStartDate: string;
    insuranceExpiryDate: string;
    pollutionImageUrl: string;
    pollutionStartDate: string;
    pollutionExpiryDate: string;
  };
  joiningDate: string;
  account_status: string;
}

const PendingDriverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driver, setDriver] = useState<DriverInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const { data } = await axiosAdmin(dispatch).get(`/driverDetails/${id}`);
        setDriver(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch driver details');
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [id, dispatch]);

  const documentGroups = [
    { label: 'Driver Image', value: 'driverImge' },
    { label: 'Aadhar Card', value: 'aadhar' },
    { label: 'License', value: 'license' },
    { label: 'Vehicle Model', value: 'model' },
    { label: 'Registration ID', value: 'registerationID' },
    { label: 'Vehicle RC', value: 'rc' },
    { label: 'Vehicle Insurance', value: 'insurance' },
    { label: 'Pollution Certificate', value: 'polution' },
    { label: 'Vehicle Photos', value: 'carImage' },
    { label: 'Location', value: 'location' },
  ];

  const handleVerification = async (status: "Verified" | "Rejected" | "Good" | "Block", fields?: string[]) => {
    if (!note) {
      toast.error("Please provide a note");
      return;
    }
    if (status === "Rejected" && (!fields || fields.length === 0)) {
      toast.error("Please select at least one document for resubmission");
      return;
    }
    try {
      const payload = status === "Rejected" ? { status: "Rejected", note, fields } : { status, note };
      const response = await axiosAdmin(dispatch).post(`/driver/verify/${id}`, payload);
      if (response.status === 200 || response.status === 202) {
        toast.success(`Driver ${status === "Rejected" ? "rejected and set to Pending" : status} successfully`);
        navigate('/admin/drivers');
      }else{
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(`Failed to ${status} driver`);
    }
  };

  if (loading) return <AdminLayout><div className="flex justify-center items-center h-full text-gray-600">Loading...</div></AdminLayout>;
  if (!driver) return <AdminLayout><div className="flex justify-center items-center h-full text-gray-600">Driver not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="h-full overflow-auto p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
              onClick={() => navigate('/admin/drivers')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-800">{driver.name}</h1>
              <p className="text-sm text-gray-500">Driver ID: {driver._id}</p>
            </div>
          </div>

          <Card className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 bg-gray-100 p-2 rounded-t-2xl">
                <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Details</TabsTrigger>
                <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Documents</TabsTrigger>
                <TabsTrigger value="map" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      {driver.driverImage && (
                        <img src={driver.driverImage} alt={driver.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
                      )}
                      <div className="space-y-4 text-center">
                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="text-gray-800">{driver.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Mobile</p>
                          <p className="text-gray-800">{driver.mobile}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Joining Date</p>
                          <p className="text-gray-800">{new Date(driver.joiningDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      {driver.account_status === 'Pending' ? 'Verification' : 'Manage Driver'}
                    </h3>
                    {isRejecting ? (
                      <div className="space-y-4">
                        <h4 className="text-md font-medium">Select documents for resubmission:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {documentGroups.map(group => (
                            <div key={group.value} className="flex items-center">
                              <input
                                type="checkbox"
                                id={group.value}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFields(prev => [...prev, group.value]);
                                  } else {
                                    setSelectedFields(prev => prev.filter(f => f !== group.value));
                                  }
                                }}
                              />
                              <label htmlFor={group.value} className="ml-2 text-sm text-gray-700">{group.label}</label>
                            </div>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Add rejection note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 mb-4 rounded-xl"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsRejecting(false);
                              setSelectedFields([]);
                            }}
                            className="rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl"
                            onClick={() => handleVerification('Rejected', selectedFields)}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Textarea
                          placeholder={driver.account_status === 'Pending' ? 'Add verification note' : 'Add reason for action'}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 mb-4 rounded-xl"
                        />
                        {driver.account_status === 'Pending' ? (
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl"
                              onClick={() => handleVerification('Verified')}
                            >
                              <Check className="mr-2 h-4 w-4" /> Accept
                            </Button>
                            <Button
                              variant="destructive"
                              className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl"
                              onClick={() => setIsRejecting(true)}
                            >
                              <X className="mr-2 h-4 w-4" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className={`w-full rounded-xl text-white ${
                              driver.account_status === 'Good'
                                ? 'bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600'
                                : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
                            }`}
                            onClick={() => handleVerification(driver.account_status === 'Good' ? 'Block' : 'Good')}
                          >
                            {driver.account_status === 'Good' ? (
                              <><Lock className="mr-2 h-4 w-4" /> Block Driver</>
                            ) : (
                              <><Unlock className="mr-2 h-4 w-4" /> Unblock Driver</>
                            )}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Existing TabsContent for "documents" and "map" remain unchanged */}
              <TabsContent value="documents" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[
                    { 
                      title: 'Aadhar Card', 
                      id: driver.aadhar?.aadharId, 
                      front: driver.aadhar?.aadharFrontImageUrl, 
                      back: driver.aadhar?.aadharBackImageUrl 
                    },
                    { 
                      title: 'License', 
                      id: driver.license?.licenseId, 
                      front: driver.license?.licenseFrontImageUrl, 
                      back: driver.license?.licenseBackImageUrl,
                      validity: driver.license?.licenseValidity
                    },
                    { 
                      title: 'Vehicle RC', 
                      id: driver.vehicle_details?.registerationID, 
                      front: driver.vehicle_details?.rcFrondImageUrl, 
                      back: driver.vehicle_details?.rcBackImageUrl,
                      start: driver.vehicle_details?.rcStartDate,
                      expiry: driver.vehicle_details?.rcExpiryDate
                    },
                    { 
                      title: 'Vehicle Insurance', 
                      id: driver.vehicle_details?.registerationID,
                      front: driver.vehicle_details?.insuranceImageUrl,
                      start: driver.vehicle_details?.insuranceStartDate,
                      expiry: driver.vehicle_details?.insuranceExpiryDate
                    },
                    {
                      title: 'Pollution Certificate',
                      id: driver.vehicle_details?.registerationID,
                      front: driver.vehicle_details?.pollutionImageUrl,
                      start: driver.vehicle_details?.pollutionStartDate,
                      expiry: driver.vehicle_details?.pollutionExpiryDate
                    },
                    { 
                      title: 'Vehicle Photos', 
                      id: driver.vehicle_details?.model, 
                      front: driver.vehicle_details?.carFrondImageUrl, 
                      back: driver.vehicle_details?.carBackImageUrl 
                    },
                  ].map((doc) => (
                    <div key={doc.title} className="bg-white p-4 rounded-xl border border-gray-200">
                      <h4 className="text-gray-800 font-medium mb-3">{doc.title}</h4>
                      <p className="text-gray-500 text-sm mb-2">ID: {doc.id || 'N/A'}</p>
                      {doc.validity && (
                        <p className="text-gray-500 text-sm mb-2">
                          Validity: {new Date(doc.validity).toLocaleDateString()}
                        </p>
                      )}
                      {doc.start && (
                        <p className="text-gray-500 text-sm mb-2">
                          Start: {new Date(doc.start).toLocaleDateString()}
                        </p>
                      )}
                      {doc.expiry && (
                        <p className="text-gray-500 text-sm mb-2">
                          Expiry: {new Date(doc.expiry).toLocaleDateString()}
                        </p>
                      )}
                      <div className="space-y-3">
                        {doc.front && (
                          <div className="relative group">
                            <img src={doc.front} alt={`${doc.title} front`} className="w-full h-40 object-cover rounded-lg" />
                            <Button
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-800/80 text-white rounded-full p-2"
                              onClick={() => setSelectedImage(doc.front)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {doc.back && (
                          <div className="relative group">
                            <img src={doc.back} alt={`${doc.title} back`} className="w-full h-40 object-cover rounded-lg" />
                            <Button
                              variant="ghost"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-800/80 text-white rounded-full p-2"
                              onClick={() => setSelectedImage(doc.back)}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map" className="p-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="text-gray-800 font-medium mb-4">Driver Location</h3>
                  {driver.location && driver.location.latitude && driver.location.longitude ? (
                    <MapContainer 
                      center={[parseFloat(driver.location.latitude), parseFloat(driver.location.longitude)]} 
                      zoom={13} 
                      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                      className="rounded-xl overflow-hidden"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[parseFloat(driver.location.latitude), parseFloat(driver.location.longitude)]}>
                        <Popup>{driver.name}'s Location</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      Location data not available
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(undefined)}>
        <DialogContent className="max-w-4xl bg-white border-none rounded-2xl p-0">
          {selectedImage && (
            <img src={selectedImage} alt="Zoomed document" className="w-full h-auto rounded-2xl" />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingDriverDetails;