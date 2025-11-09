import { useNavigate } from "react-router-dom";
import { TabsContent } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Check,
  X,
  Lock,
  Unlock,
  MapPin,
  DollarSign,
  Car,
  Ban,
} from "lucide-react";
import { DriverDetailsTabProps } from "../type";

const documentGroups = [
  { label: "Driver Image", value: "driverImage" },
  { label: "Aadhar Card", value: "aadhar" },
  { label: "License", value: "license" },
  { label: "Vehicle Model", value: "model" },
  { label: "Registration ID", value: "registrationId" },
  { label: "Vehicle RC", value: "rc" },
  { label: "Vehicle Insurance", value: "insurance" },
  { label: "Pollution Certificate", value: "pollution" },
  { label: "Vehicle Photos", value: "carImage" },
];

const DriverDetailsTab = ({
  driver,
  note,
  setNote,
  isRejecting,
  setIsRejecting,
  selectedFields,
  setSelectedFields,
  handleVerification,
}: DriverDetailsTabProps) => {
  const navigate = useNavigate()

  return (
    <TabsContent value="details" className="p-4 sm:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Driver Profile Section */}
        <div className="space-y-6">
          <Card className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
            <div className="text-center">
                <img
                  src={driver.driverImage}
                  alt={driver.name || "Driver"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
                />
              <div className="space-y-3 text-sm sm:text-base">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                  <p className="text-gray-800 break-words">
                    {driver.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Mobile</p>
                  <p className="text-gray-800">
                    {driver.mobile ? `+91 ${driver.mobile}` : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Joining Date
                  </p>
                  <p className="text-gray-800">
                    {driver.joiningDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address
                  </p>
                  <p className="text-gray-800 text-xs break-words">
                    {driver.address}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Section */}
        <div className="xl:col-span-2 bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Earnings Card */}
            <Card className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                Today's Earnings
              </h3>
              <div className="text-center mb-4">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ₹{driver.todayEarnings}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full text-green-700 border-green-300 hover:bg-green-100 text-xs sm:text-sm"
                onClick={() =>
                  navigate(`/admin/drivers/${driver.id}/earnings`)
                }
              >
                View All Earnings
              </Button>
            </Card>

            {/* Ride Statistics Card */}
            <Card className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
                <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                Ride Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-blue-600">
                    {driver.totalCompletedRides}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-red-600">
                    {driver.totalCancelledRides}
                  </p>
                  <p className="text-xs sm:text-sm text-red-700">Cancelled</p>
                </div>
              </div>
            </Card>
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            {driver.accountStatus === "Pending"
              ? "Verification"
              : "Manage Driver"}
          </h3>
          {isRejecting ? (
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-medium">
                Select documents for resubmission:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {documentGroups.map((group) => (
                  <div key={group.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={group.value}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields([...selectedFields, group.value]);
                        } else {
                          setSelectedFields(
                            selectedFields.filter((f) => f !== group.value)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={group.value}
                      className="text-xs sm:text-sm text-gray-700"
                    >
                      {group.label}
                    </label>
                  </div>
                ))}
              </div>

              <Textarea
                placeholder="Add rejection note (required)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl min-h-[100px]"
                required
              />

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejecting(false);
                    setSelectedFields([]);
                    setNote("");
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl"
                  onClick={() => handleVerification("Rejected", selectedFields)}
                  disabled={!note.trim() || selectedFields.length === 0}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Textarea
                placeholder={
                  driver.accountStatus === "Pending"
                    ? "Add verification note (required)"
                    : "Add reason for action (required)"
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 mb-4 rounded-xl min-h-[100px]"
                required
              />

              {driver.accountStatus === "Pending" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl"
                    onClick={() => handleVerification("Good")}
                    disabled={!note.trim()}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept Driver
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl"
                    onClick={() => setIsRejecting(true)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Driver
                  </Button>
                </div>
              ) : (
                <Button
                  className={`w-full rounded-xl text-white ${
                    driver.accountStatus === "Good"
                      ? "bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600"
                      : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                  }`}
                  onClick={() =>
                    handleVerification(
                      driver.accountStatus === "Good" ? "Blocked" : "Good"
                    )
                  }
                  disabled={!note.trim()}
                >
                  {driver.accountStatus === "Good" ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" /> Block Driver
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" /> Unblock Driver
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default DriverDetailsTab;
