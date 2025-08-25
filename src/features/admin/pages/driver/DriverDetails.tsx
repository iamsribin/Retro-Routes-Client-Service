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
import DriverDetailsTab from "@/features/admin/components/drivers/DriverDetailsTab";
import DriverDocumentsTab from "@/features/admin/components/drivers/DriverDocumentsTab";
import DriverAccountTab from "@/features/admin/components/drivers/DriverAccountTab";
import { DriverInterface } from "@/shared/types/driver/driverType";
import { isAbortError } from "@/shared/utils/checkAbortControllerError";
import { fetchData, postData } from "@/shared/services/api/api-service";
import ApiEndpoints from "@/constants/api-end-pointes";
import { ResponseCom } from "@/shared/types/commonTypes";

const PendingDriverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driver, setDriver] = useState<
    | (Omit<DriverInterface, "password" | "referralCode" | "_id"> & {
        _id: string;
      })
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDriver = async () => {
      try {
        setLoading(true);
        const data = await fetchData<ResponseCom["data"]>(
          `${ApiEndpoints.ADMIN_DRIVER_DETAILS}/${id}`,
          "Admin",
          signal
        );
        setDriver(data);
      } catch (error: any) {
        if (!isAbortError(error))
          toast.error(error?.message || "Failed to update driver status");
        console.error("Error fe tch Driver details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriver();
    }

    return () => controller.abort();
  }, [id, dispatch]);

  const handleVerification = async (
    status: "Rejected" | "Good" | "Blocked",
    fields?: string[]
  ) => {
    if (!note.trim()) {
      toast.error("Please provide a note");
      return;
    }

    if (status === "Rejected" && (!fields || fields.length === 0)) {
      toast.error("Please select at least one document for resubmission");
      return;
    }

    const payload =
      status === "Rejected"
        ? { status: "Rejected", note: note.trim(), fields }
        : { status, note: note.trim() };

    try {
       const response = await postData<ResponseCom["data"]>(
        `${ApiEndpoints.ADMIN_UPDATE_DRIVER_STATUS}${id}`,
        "Admin",
        payload
      );

      if (response.status === 200 || response.status === 202) {
        toast.success(
          `Driver ${
            status === "Rejected" ? "rejected and set to Pending" : status
          } successfully`
        );
        navigate("/admin/drivers");
      } else {
        toast.error(response.data || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error(`Failed to ${status.toLowerCase()} driver`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Loading driver details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!driver) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-full text-gray-600">
          <div className="text-xl mb-2">Driver not found</div>
          <Button onClick={() => navigate("/admin/drivers")} variant="outline">
            Back to Drivers List
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-full overflow-auto p-4 sm:p-6 bg-gray-50">
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {driver.name || "Unknown Driver"}
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                Status: {driver.accountStatus || "Unknown"}
              </p>
            </div>
          </div>

          <Card className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-3 bg-gray-100 p-2 rounded-t-2xl">
                <TabsTrigger
                  value="details"
                  className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs sm:text-sm"
                >
                  Account
                </TabsTrigger>
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

              <DriverDocumentsTab
                driver={driver}
                setSelectedImage={setSelectedImage}
              />

              <DriverAccountTab driver={driver} />
            </Tabs>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(undefined)}
      >
        <DialogContent className="max-w-4xl bg-white border-none rounded-2xl p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed document"
              className="w-full h-auto rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
                console.error("Error loading image:", selectedImage);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingDriverDetails;
