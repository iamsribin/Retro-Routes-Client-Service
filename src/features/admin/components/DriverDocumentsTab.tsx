import { TabsContent } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { DriverDocumentsTabProps } from "../type";

const DriverDocumentsTab = ({ driver, setSelectedImage }: DriverDocumentsTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<{front?: string, back?: string}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDocTitle, setCurrentDocTitle] = useState("");

  const isExpired = (expiryDate?: Date | string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return expiry < today;
  };
  const openImageModal = (front?: string, back?: string, title?: string) => {
    const images = [];
    if (front) images.push(front);
    if (back) images.push(back);
    
    if (images.length > 0) {
      setCurrentImages({ front, back });
      setCurrentImageIndex(0);
      setCurrentDocTitle(title || "");
      setIsModalOpen(true);
    }
  };

  // Get current images array for navigation
  const getCurrentImagesArray = () => {
    const images = [];
    if (currentImages.front) images.push({ url: currentImages.front, type: 'Front' });
    if (currentImages.back) images.push({ url: currentImages.back, type: 'Back' });
    return images;
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const images = getCurrentImagesArray();
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateImage('next');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  const documents = [
    {
      title: "Aadhar Card",
      id: driver?.aadhar?.id,
      front: driver?.aadhar?.frontImageUrl,
      back: driver?.aadhar?.backImageUrl,
      hasExpiry: false,
    },
    {
      title: "License",
      id: driver?.license?.id,
      front: driver?.license?.frontImageUrl,
      back: driver?.license?.backImageUrl,
      validity: driver?.license?.validity,
      hasExpiry: true,
      isExpired: isExpired(driver?.license?.validity),
    },
    {
      title: "RC",
      id: driver.rc.registrationId,
      front: driver.rc.rcFrontImageUrl,
      back: driver.rc?.rcBackImageUrl,
      start: driver?.rc?.rcStartDate,
      expiry: driver?.rc?.rcExpiryDate,
      hasExpiry: true,
      isExpired: isExpired(driver?.rc?.rcExpiryDate),
    },
    {
      title: "Insurance",
      id: 123,
      front: driver?.insurance?.insuranceImageUrl,
      start: driver?.insurance?.insuranceStartDate,
      expiry: driver?.insurance?.insuranceExpiryDate,
      hasExpiry: true,
      isExpired: isExpired(driver?.insurance?.insuranceExpiryDate),
    },
    {
      title: "Pollution Certificate",
      id: 123,
      front: driver?.pollution?.pollutionImageUrl,
      start: driver?.pollution?.pollutionStartDate,
      expiry: driver?.pollution?.pollutionExpiryDate,
      hasExpiry: true,
      isExpired: isExpired(driver?.pollution?.pollutionExpiryDate),
    },
    {
      title: "Vehicle Photos",
      id:123,
      model: driver?.vehicle?.model,
      color: driver?.vehicle?.vehicleColor,
      vehicleNumber: driver?.vehicle?.vehicleNumber,
      front: driver?.vehicle?.carFrontImageUrl,
      back: driver?.vehicle?.carBackImageUrl,
      hasExpiry: false,
    },
  ];  

  return (
    <>
      <TabsContent value="documents" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.title} 
              className={`bg-white p-4 rounded-xl border-2 transition-colors ${
                doc.isExpired 
                  ? 'border-red-500 shadow-red-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-800 font-semibold">{doc.title}</h4>
                {doc.isExpired && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    Expired
                  </span>
                )}
              </div>
              
              {/* Document Information */}
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">ID:</span> {doc.id || "N/A"}
                </p>

                {doc.model && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Model:</span> {doc.model}
                  </p>
                )}

                {doc.color && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Color:</span> {doc.color}
                  </p>
                )}
                
                {doc.validity && (
                  <p className={`text-sm ${doc.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                    <span className="font-medium">Validity:</span> {new Date(doc.validity).toLocaleDateString()}
                  </p>
                )}
                
                {doc.start && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Start:</span> {new Date(doc.start).toLocaleDateString()}
                  </p>
                )}
                
                {doc.expiry && (
                  <p className={`text-sm ${doc.isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                    <span className="font-medium">Expiry:</span> {new Date(doc.expiry).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Document Images Thumbnails */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {doc.front && (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={doc.front} 
                          alt={`${doc.title} front`} 
                          className="w-full h-24 object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        Front
                      </div>
                    </div>
                  )}
                  
                  {doc.back && (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={doc.back} 
                          alt={`${doc.title} back`} 
                          className="w-full h-24 object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        Back
                      </div>
                    </div>
                  )}
                </div>

                {/* Zoom Button */}
                {(doc.front || doc.back) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openImageModal(doc.front, doc.back, doc.title)}
                  >
                    <ZoomIn className="h-4 w-4 mr-2" />
                    View Images
                  </Button>
                )}

                {/* Show message if no images are available */}
                {!doc.front && !doc.back && (
                  <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No images available</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Image Modal/Slideshow */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Display */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentDocTitle} - {getCurrentImagesArray()[currentImageIndex]?.type}
                </h3>
              </div>
              
              <div className="relative min-h-[400px] bg-gray-100">
                <img 
                  src={getCurrentImagesArray()[currentImageIndex]?.url} 
                  alt={`${currentDocTitle} ${getCurrentImagesArray()[currentImageIndex]?.type}`}
                  className="w-full max-h-[70vh] object-contain mx-auto"
                />

                {/* Navigation Buttons - Always show if multiple images */}
                {getCurrentImagesArray().length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 z-10 shadow-lg"
                      onClick={() => navigateImage('prev')}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 z-10 shadow-lg"
                      onClick={() => navigateImage('next')}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image indicators */}
                {getCurrentImagesArray().length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {getCurrentImagesArray().map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Image Counter and Navigation Info */}
              <div className="p-4 bg-gray-50 text-center">
                {getCurrentImagesArray().length > 1 ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {currentImageIndex + 1} of {getCurrentImagesArray().length}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateImage('prev')}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateImage('next')}
                        disabled={currentImageIndex === getCurrentImagesArray().length - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Use arrow keys to navigate
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    Single image view
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverDocumentsTab;