import React, { useEffect, useState } from 'react';
import { FileText, Edit3, Calendar, AlertTriangle, X, Eye, ZoomIn, Save, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import DriverNavbar from '../components/DriverNavbar';
import driverAxios from "../../../shared/services/axios/driverAxios"
import { useDispatch } from 'react-redux';
import { StatusCode } from '@/shared/types/enum';
import { showNotification } from '@/shared/services/redux/slices/notificationSlice';
import logoutLocalStorage from '@/shared/utils/localStorage';
import { driverLogout } from '@/shared/services/redux/slices/driverAuthSlice';
import { toast } from 'sonner';

interface ApiResponse {
  status: number;
  message: string;
  data: DriverData;
}

interface Aadhar {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
}

interface License {
  id: string;
  frontImageUrl: string;
  backImageUrl: string;
  validity: Date;
}

interface VehicleRC {
  registrationId: string;
  rcFrontImageUrl: string;
  rcBackImageUrl: string;
  rcStartDate: Date;
  rcExpiryDate: Date;
}

interface VehicleDetails {
  vehicleNumber: string;
  vehicleColor: string;
  model: string;
  carFrontImageUrl: string;
  carBackImageUrl: string;
}

interface Insurance {
  insuranceImageUrl: string;
  insuranceStartDate: Date;
  insuranceExpiryDate: Date;
}

interface Pollution {
  pollutionImageUrl: string;
  pollutionStartDate: Date;
  pollutionExpiryDate: Date;
}

interface DriverData {
  _id: string;
  aadhar: Aadhar;
  license: License;
  vehicleRC: VehicleRC;
  vehicleDetails: VehicleDetails;
  insurance: Insurance;
  pollution: Pollution;
}

interface FormData {
  id?: string;
  frontImageUrl?: File | null;
  backImageUrl?: File | null;
  validity?: string;
  registrationId?: string;
  rcStartDate?: string;
  rcFrontImageUrl:File | null;
  carFrontImageUrl:File | null;
  carBackImageUrl:File | null;
  insuranceImageUrl:File | null;
  pollutionImageUrl:File | null;
  rcExpiryDate?: string;
  vehicleNumber?: string;
  vehicleColor?: string;
  model?: string;
  insuranceStartDate?: string;
  insuranceExpiryDate?: string;
  pollutionStartDate?: string;
  pollutionExpiryDate?: string;
}

interface ImageModal {
  images: string[];
  currentIndex: number;
  title: string;
  isOpen: boolean;
}

interface ImagePreview {
  [key: string]: string;
}

interface DocumentField {
  key: string;
  label: string;
  type: 'text' | 'date';
}

interface DocumentImage {
  key: string;
  label: string;
  url: string;
}

interface DisplayData {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  status?: 'expired' | 'expiring' | 'valid';
}

type DocumentStatus = 'expired' | 'expiring' | 'valid';

interface DocumentConfig {
  key: string;
  title: string;
  data: Aadhar | License | VehicleRC | VehicleDetails | Insurance | Pollution;
  status?: DocumentStatus;
  fields: DocumentField[];
  images: DocumentImage[];
  displayData: DisplayData[];
}

const DriverDocuments: React.FC = () => {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<FormData>({});
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<ImageModal>({ 
    images: [], 
    currentIndex: 0, 
    title: '', 
    isOpen: false 
  });
  const [imagePreviews, setImagePreviews] = useState<ImagePreview>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDriverDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data }: { data: DriverData } = await driverAxios(dispatch).get("/get-my-documents");
        console.log("fetchDriverDocuments data==", data);
        
        if (data) {
          setDriverData(data);
        } else {
          setError('No driver data found');
        }
      } catch (err) {
        console.error('Error fetching driver documents:', err);
        setError('Failed to fetch driver documents');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverDocuments();
  }, [dispatch]);

  // Utility functions
  const getExpiryStatus = (date: Date): DocumentStatus => {
    const now = new Date();
    const expiryDate = new Date(date);
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (expiryDate < now) return 'expired';
    if (expiryDate < oneWeekFromNow) return 'expiring';
    return 'valid';
  };

  const getStatusColor = (status: DocumentStatus): string => {
    const statusColors = {
      expired: 'border-red-500 bg-red-50',
      expiring: 'border-yellow-500 bg-yellow-50',
      valid: 'border-gray-200 bg-white'
    };
    return statusColors[status];
  };

  const getStatusBadge = (status: DocumentStatus): JSX.Element => {
    const badges = {
      expired: <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Expired</span>,
      expiring: <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Expires Soon</span>,
      valid: <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Valid</span>
    };
    return badges[status];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Event handlers
  const handleEdit = (section: string): void => {
    setEditingSection(section);
    setShowWarning(true);
  };

  const handleContinueEdit = (): void => {
    setShowWarning(false);
    initializeFormData();
  };

  const initializeFormData = (): void => {
    if (!driverData || !editingSection) return;

    const formDataMap: Record<string, any> = {
      aadhar: { 
        id: driverData.aadhar.id, 
        frontImageUrl: null, 
        backImageUrl: null 
      },
      license: { 
        id: driverData.license.id, 
        validity: driverData.license.validity.toISOString().split('T')[0], 
        frontImageUrl: null, 
        backImageUrl: null 
      },
      vehicleRC: { 
        registrationId: driverData.vehicleRC.registrationId, 
        rcStartDate: driverData.vehicleRC.rcStartDate.toISOString().split('T')[0], 
        rcExpiryDate: driverData.vehicleRC.rcExpiryDate.toISOString().split('T')[0], 
        rcFrontImageUrl: null, 
        backImageUrl: null 
      },
      vehicleDetails: { 
        vehicleNumber: driverData.vehicleDetails.vehicleNumber, 
        vehicleColor: driverData.vehicleDetails.vehicleColor, 
        model: driverData.vehicleDetails.model, 
        carFrontImage: null, 
        carBackImage: null 
      },
      insurance: { 
        insuranceStartDate: driverData.insurance.insuranceStartDate.toISOString().split('T')[0], 
        insuranceExpiryDate: driverData.insurance.insuranceExpiryDate.toISOString().split('T')[0], 
        insuranceImage: null 
      },
      pollution: { 
        pollutionStartDate: driverData.pollution.pollutionStartDate.toISOString().split('T')[0], 
        pollutionExpiryDate: driverData.pollution.pollutionExpiryDate.toISOString().split('T')[0], 
        pollutionImage: null 
      }
    };
    
    setEditFormData(formDataMap[editingSection] || {});
  };

  const handleCancelEdit = (): void => {
    setEditingSection(null);
    setEditFormData({});
    setShowWarning(false);
    setImagePreviews({});
  };

  const handleInputChange = (field: string, value: string): void => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null): void => {
    setEditFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setImagePreviews(prev => ({ ...prev, [field]: result as string }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[field];
        return newPreviews;
      });
    }
  };

const handleSubmit = async (): Promise<void> => {
  setIsSubmitting(true);
  try {
    const formData = new FormData();
    if(!editingSection) return
    formData.append('section', editingSection); 
    
for (const [key, value] of Object.entries(editFormData)) {
  if (value instanceof File || typeof value === 'string') {
    formData.append(key, value);
  }
}

   const {data} =  await driverAxios(dispatch).put("/update-driver-documents", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

  if (data.status == StatusCode.OK) {
       dispatch(driverLogout());
       logoutLocalStorage("Driver");
       dispatch(
         showNotification({
           type: "info",
           message:
             "Profile updated successfully! Logging out for admin verification.",
           data: null,
           navigate: "/driver/login",
         })
       );
     } else {
       toast.error("something went wrong try later");
     }
   } catch (error: any) {
     console.error("Error updating profile:", error);
     toast.error(
       error.response?.data?.message ||
         "Failed to update profile. Please try again."
     );
   } finally {
setIsSubmitting(false);
  }
};


  const openImageModal = (images: string[], title: string): void => {
    const validImages = images.filter(img => img && img.trim() !== '');
    setImageModal({ 
      images: validImages, 
      currentIndex: 0, 
      title, 
      isOpen: true 
    });
  }; 

  const closeImageModal = (): void => {
    setImageModal(prev => ({ ...prev, isOpen: false }));
  };

  const nextImage = (): void => {
    setImageModal(prev => ({ 
      ...prev, 
      currentIndex: (prev.currentIndex + 1) % prev.images.length 
    }));
  };

  const prevImage = (): void => {
    setImageModal(prev => ({ 
      ...prev, 
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1 
    }));
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 sm:pb-4 sm:pl-64">
        <DriverNavbar />
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading documents...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !driverData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 sm:pb-4 sm:pl-64">
        <DriverNavbar />
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error || 'No driver data available'}</div>
          </div>
        </div>
      </div>
    );
  }

  // Component configurations
  const documentConfigs: DocumentConfig[] = [
    {
      key: 'aadhar',
      title: 'Aadhar Card',
      data: driverData.aadhar,
      fields: [{ key: 'id', label: 'Aadhar Number', type: 'text' }],
      images: [
        { key: 'frontImageUrl', label: 'Front Image', url: 'frontImageUrl' }, 
        { key: 'backImageUrl', label: 'Back Image', url: 'backImageUrl' }
      ],
      displayData: [{ label: 'ID', value: driverData.aadhar.id }]
    },
    {
      key: 'license',
      title: 'License',
      data: driverData.license,
      status: getExpiryStatus(driverData.license.validity),
      fields: [
        { key: 'id', label: 'License Number', type: 'text' }, 
        { key: 'validity', label: 'Validity Date', type: 'date' }
      ],
      images: [
        { key: 'frontImageUrl', label: 'Front Image', url: 'frontImageUrl' }, 
        { key: 'backImageUrl', label: 'Back Image', url: 'backImageUrl' }
      ],
      displayData: [
        { label: 'ID', value: driverData.license.id }, 
        { label: 'Validity', value: formatDate(driverData.license.validity), icon: Calendar }
      ]
    },
    {
      key: 'vehicleRC',
      title: 'Vehicle RC',
      data: driverData.vehicleRC,
      status: getExpiryStatus(driverData.vehicleRC.rcExpiryDate),
      fields: [
        { key: 'registrationId', label: 'Registration ID', type: 'text' }, 
        { key: 'rcStartDate', label: 'Start Date', type: 'date' }, 
        { key: 'rcExpiryDate', label: 'Expiry Date', type: 'date' }
      ],
      images: [
        { key: 'rcFrontImageUrl', label: 'Front Image', url: 'rcFrontImageUrl' }, 
        { key: 'rcBackImageUrl', label: 'Back Image', url: 'rcBackImageUrl' }
      ],
      displayData: [
        { label: 'ID', value: driverData.vehicleRC.registrationId }, 
        { label: 'Start', value: formatDate(driverData.vehicleRC.rcStartDate) }, 
        { 
          label: 'Expiry', 
          value: formatDate(driverData.vehicleRC.rcExpiryDate), 
          status: getExpiryStatus(driverData.vehicleRC.rcExpiryDate) 
        }
      ]
    },
    {
      key: 'vehicleDetails',
      title: 'Vehicle Photos',
      data: driverData.vehicleDetails,
      fields: [
        { key: 'vehicleNumber', label: 'Vehicle Number', type: 'text' }, 
        { key: 'vehicleColor', label: 'Vehicle Color', type: 'text' }, 
        { key: 'model', label: 'Model', type: 'text' }
      ],
      images: [
        { key: 'carFrontImageUrl', label: 'Front Image', url: 'carFrontImageUrl' }, 
        { key: 'carBackImageUrl', label: 'Back Image', url: 'carBackImageUrl' }
      ],
      displayData: [
        { label: 'Vehicle Number', value: driverData.vehicleDetails.vehicleNumber }, 
        { label: 'Color', value: driverData.vehicleDetails.vehicleColor }, 
        { label: 'Model', value: driverData.vehicleDetails.model }
      ]
    },
    {
      key: 'insurance',
      title: 'Insurance',
      data: driverData.insurance,
      status: getExpiryStatus(driverData.insurance.insuranceExpiryDate),
      fields: [
        { key: 'insuranceStartDate', label: 'Start Date', type: 'date' }, 
        { key: 'insuranceExpiryDate', label: 'Expiry Date', type: 'date' }
      ],
      images: [
        { key: 'insuranceImageUrl', label: 'Insurance Document', url: 'insuranceImageUrl' }
      ],
      displayData: [
        { label: 'Start', value: formatDate(driverData.insurance.insuranceStartDate) }, 
        { 
          label: 'Expiry', 
          value: formatDate(driverData.insurance.insuranceExpiryDate), 
          status: getExpiryStatus(driverData.insurance.insuranceExpiryDate) 
        }
      ]
    },
    {
      key: 'pollution',
      title: 'Pollution Certificate',
      data: driverData.pollution,
      status: getExpiryStatus(driverData.pollution.pollutionExpiryDate),
      fields: [
        { key: 'pollutionStartDate', label: 'Start Date', type: 'date' }, 
        { key: 'pollutionExpiryDate', label: 'Expiry Date', type: 'date' }
      ],
      images: [
        { key: 'pollutionImageUrl', label: 'Pollution Certificate', url: 'pollutionImageUrl' }
      ],
      displayData: [
        { label: 'Start', value: formatDate(driverData.pollution.pollutionStartDate) }, 
        { 
          label: 'Expiry', 
          value: formatDate(driverData.pollution.pollutionExpiryDate), 
          status: getExpiryStatus(driverData.pollution.pollutionExpiryDate) 
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-4 sm:pl-64">
      <DriverNavbar />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">Manage and update your driving documents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {documentConfigs.map(config => (
            <div 
              key={config.key} 
              className={`p-6 rounded-xl shadow-sm border-2 transition-all duration-200 ${getStatusColor(config.status || 'valid')}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
                  {getStatusBadge(config.status || 'valid')}
                </div>
                <button 
                  onClick={() => handleEdit(config.key)} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {editingSection === config.key ? (
                <div className="space-y-4">
                  {config.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={editFormData[field.key as keyof FormData] as string || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                  <div className={config.images.length > 1 ? "grid grid-cols-2 gap-4" : ""}>
                    {config.images.map(image => (
                      <div key={image.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {image.label}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(image.key, e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {imagePreviews[image.key] && (
                          <img 
                            src={imagePreviews[image.key]} 
                            alt="Preview" 
                            className="mt-2 w-full h-20 object-cover rounded-lg" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting} 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </button>
                    <button 
                      onClick={handleCancelEdit} 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-2 mb-4">
                    {config.displayData.map((item, index) => (
                      <p 
                        key={index} 
                        className={`text-sm flex items-center ${
                          item.status === 'expired' 
                            ? 'text-red-600' 
                            : item.status === 'expiring' 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                        }`}
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                        <strong>{item.label}:</strong> {item.value}
                        {item.status && item.status !== 'valid' && (
                          <AlertTriangle className="w-4 h-4 ml-1" />
                        )}
                      </p>
                    ))}
                  </div>
                  <div className={config.images.length > 1 ? "grid grid-cols-2 gap-4" : "text-center"}>
                    {config.images.map(image => {
                      const imageUrl = (config.data as any)[image.url];
                      return (
                        <div key={image.key} className="text-center">
                          <p className="text-sm font-medium text-gray-700 mb-2">{image.label}</p>
                          <div className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200">
                            <img 
                              src={imageUrl} 
                              alt={image.label} 
                              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
                              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={20} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={() => openImageModal(
                        config.images.map(img => (config.data as any)[img.url] as string), 
                        config.title
                      )} 
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Images
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {imageModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{imageModal.title}</h2>
                <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <img 
                  src={imageModal.images[imageModal.currentIndex]} 
                  alt={`${imageModal.title} ${imageModal.currentIndex + 1}`} 
                  className="w-full max-h-[70vh] object-contain rounded-lg" 
                />
                {imageModal.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-center mt-4 text-sm text-gray-600">
                Image {imageModal.currentIndex + 1} of {imageModal.images.length}
              </p>
            </div>
          </div>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900">Warning</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Updating your documents will require admin verification. You will be logged out after submission until verification is complete.
              </p>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={handleContinueEdit} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDocuments;