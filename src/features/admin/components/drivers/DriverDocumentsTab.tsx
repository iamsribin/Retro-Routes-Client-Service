import { TabsContent } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { ZoomIn } from "lucide-react";
import { DriverDocumentsTabProps } from "./type";

const DriverDocumentsTab = ({ driver, setSelectedImage }: DriverDocumentsTabProps) => {
  const documents = [
    {
      title: "Aadhar Card",
      id: driver.aadhar?.aadharId,
      front: driver.aadhar?.aadharFrontImageUrl,
      back: driver.aadhar?.aadharBackImageUrl,
    },
    {
      title: "License",
      id: driver.license?.licenseId,
      front: driver.license?.licenseFrontImageUrl,
      back: driver.license?.licenseBackImageUrl,
      validity: driver.license?.licenseValidity,
    },
    {
      title: "Vehicle RC",
      id: driver.vehicle_details?.registrationID,
      front: driver.vehicle_details?.rcFrondImageUrl,
      back: driver.vehicle_details?.rcBackImageUrl,
      start: driver.vehicle_details?.rcStartDate,
      expiry: driver.vehicle_details?.rcExpiryDate,
    },
    {
      title: "Vehicle Insurance",
      id: driver.vehicle_details?.registrationID,
      front: driver.vehicle_details?.insuranceImageUrl,
      start: driver.vehicle_details?.insuranceStartDate,
      expiry: driver.vehicle_details?.insuranceExpiryDate,
    },
    {
      title: "Pollution Certificate",
      id: driver.vehicle_details?.registrationID,
      front: driver.vehicle_details?.pollutionImageUrl,
      start: driver.vehicle_details?.pollutionStartDate,
      expiry: driver.vehicle_details?.pollutionExpiryDate,
    },
    {
      title: "Vehicle Photos",
      id: driver.vehicle_details?.model,
      front: driver.vehicle_details?.carFrondImageUrl,
      back: driver.vehicle_details?.carBackImageUrl,
    },
  ];

  return (
    <TabsContent value="documents" className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <div key={doc.title} className="bg-white p-4 rounded-xl border border-gray-200">
            <h4 className="text-gray-800 font-medium mb-3">{doc.title}</h4>
            <p className="text-gray-500 text-sm mb-2">ID: {doc.id || "N/A"}</p>
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
  );
};

export default DriverDocumentsTab;