import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/features/admin/components/admin/AdminLayout";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { axiosAdmin } from "@/shared/services/axios/adminAxios";
import DriverDetailsTab from "@/features/admin/components/drivers/DriverDetailsTab";
import DriverDocumentsTab from "@/features/admin/components/drivers/DriverDocumentsTab";
import DriverLocationTab from "@/features/admin/components/drivers/DriverLocationTab";
import ApiEndpoints from "@/constants/api-end-pointes";
import { DriverInterface } from "@/shared/types/driver/driverType";

const PendingDriverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driver, setDriver] = useState<DriverInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
console.log("driver====",driver);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_DRIVER_DETAILS+`/${id}`);
        setDriver(data);
        setLoading(false);
      } catch {
        toast.error("Failed to fetch driver details");
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [id, dispatch]);

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
      const response = await axiosAdmin(dispatch).post(ApiEndpoints.ADMIN_UPDATE_DRIVER_STATUS+`${id}`, payload);
      if (response.status === 200 || response.status === 202) {
        toast.success(`Driver ${status === "Rejected" ? "rejected and set to Pending" : status} successfully`);
        navigate("/admin/drivers");
      } else {
        toast.error(response.data);
      }
    } catch {
      toast.error(`Failed to ${status.toLowerCase()} driver`);
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
              onClick={() => navigate("/admin/drivers")}
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
              <DriverDetailsTab
                driver={driver}
                note={note}
                setNote={setNote}
                isRejecting={isRejecting}
                setIsRejecting={setIsRejecting}
                selectedFields={selectedFields}
                setSelectedFields={setSelectedFields}
                handleVerification={handleVerification}
              />
              <DriverDocumentsTab driver={driver} setSelectedImage={setSelectedImage} />
              <DriverLocationTab driver={driver} />
            </Tabs>
          </Card>
        </div>
      </div>
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(undefined)}>
        <DialogContent className="max-w-4xl bg-white border-none rounded-2xl p-0">
          {selectedImage && <img src={selectedImage} alt="Zoomed document" className="w-full h-auto rounded-2xl" />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingDriverDetails;