import { TabsContent } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Check, X, Lock, Unlock } from "lucide-react";
import { DriverDetailsTabProps } from "./type";

const documentGroups = [
  { label: "Driver Image", value: "driverImge" },
  { label: "Aadhar Card", value: "aadhar" },
  { label: "License", value: "license" },
  { label: "Vehicle Model", value: "model" },
  { label: "Registration ID", value: "registrationID" },
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
}: DriverDetailsTabProps
) => {
  return (
    <TabsContent value="details" className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            {driver.driverImage && (
              <img
                src={driver.driverImage}
                alt={driver.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
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
            {driver.account_status === "Pending" ? "Verification" : "Manage Driver"}
          </h3>
          {isRejecting ? (
            <div className="space-y-4">
              <h4 className="text-md font-medium">Select documents for resubmission:</h4>
              <div className="grid grid-cols-2 gap-2">
                {documentGroups.map((group) => (
                  <div key={group.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={group.value}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields([...selectedFields, group.value]);
                        } else {
                          setSelectedFields(selectedFields.filter((f) => f !== group.value)); 
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
                  onClick={() => handleVerification("Rejected", selectedFields)}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Textarea
                placeholder={driver.account_status === "Pending" ? "Add verification note" : "Add reason for action"}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 mb-4 rounded-xl"
              />
              {driver.account_status === "Pending" ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl"
                    onClick={() => handleVerification("Verified")}
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
                    driver.account_status === "Good"
                      ? "bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600"
                      : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                  }`}
                  onClick={() => handleVerification(driver.account_status === "Good" ? "Block" : "Good")}
                >
                  {driver.account_status === "Good" ? (
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