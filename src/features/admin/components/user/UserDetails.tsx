import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import { Dialog } from "@material-tailwind/react";

import { userBlockUnblockValidation } from "@/shared/utils/validation";
import { useSocket } from "@/context/socket-context";

import ApiEndpoints from "@/constants/api-end-pointes";
import { UserInterface } from "@/shared/types/user/userTypes";
import { fetchData, patchData } from "@/shared/services/api/api-service";
import { ResponseCom } from "@/shared/types/commonTypes";

const UserDetails = () => {
  const [statusModal, setStatusModal] = useState(false);
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const getData = async () => {
    try {
      const data = await fetchData<ResponseCom["data"]>(
        ApiEndpoints.ADMIN_USER_DETAILS + `?id=${id}`,
        "Admin"
      );
      setUserData(data);
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formikStatus = useFormik({
    initialValues: {
      reason: "",
      status: "",
    },
    validationSchema: userBlockUnblockValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const  data  = await patchData<ResponseCom["data"]>(
          ApiEndpoints.ADMIN_UPDATE_USER_STATUS + `?id=${id}`,
          "Admin",
          values
        );
        console.log("update user stauts data==", data);

        if (data.message === "Success") {
          setStatusModal(false);
          toast.success("Status updated successfully!");
          if (socket && isConnected) {
            socket.emit("block-user", { userId: data.userId });
          }
          navigate("/admin/users");
        } else {
          toast.error("Something internal error");
        }
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      {statusModal && (
        <Dialog
          open={statusModal}
          handler={formikStatus.handleSubmit}
          className="bg-transparent"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {/* Dialog content remains the same */}
          <div className="w-full h-full relative flex justify-center">
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                  <form onSubmit={formikStatus.handleSubmit}>
                    <div className="mt-2 text-center">
                      <h1 className="text-xl font-bold">Change User Status</h1>
                      <p className="mt-2 text-sm text-gray-500">
                        Please provide details for status change
                      </p>
                    </div>
                    <select
                      name="status"
                      onChange={formikStatus.handleChange}
                      onBlur={formikStatus.handleBlur}
                      className="select select-info select-sm w-full max-w-xs mt-4"
                    >
                      <option disabled selected>
                        Select status
                      </option>
                      <option>Block</option>
                      <option>Good</option>
                    </select>
                    <div className="text-center mt-1 text-red-500">
                      <p className="text-xs">
                        {formikStatus.touched.status &&
                          formikStatus.errors.status}
                      </p>
                    </div>
                    <textarea
                      name="reason"
                      onBlur={formikStatus.handleBlur}
                      onChange={formikStatus.handleChange}
                      className="w-full px-3 py-2 mt-4 text-sm border rounded-md"
                      placeholder="Reason for status change"
                    />
                    <div className="text-center mt-1 text-red-500">
                      <p className="text-xs">
                        {formikStatus.touched.reason &&
                          formikStatus.errors.reason}
                      </p>
                    </div>
                    <div className="mt-5 sm:flex sm:justify-center gap-4">
                      <button
                        onClick={() => setStatusModal(false)}
                        className="px-4 py-2 text-blue-600 rounded-md"
                      >
                        Dismiss
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                      >
                        Update Status
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold text-black mb-6">User Profile</h1>

        {userData && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <img
                  className="w-32 h-32 rounded-full object-cover mb-4"
                  src={userData.userImage}
                  alt="User profile"
                />
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Mobile:</span>
                  <span>{userData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Joining Date:</span>
                  <span>
                    {new Date(userData.joiningDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Referral Code:</span>
                  <span>{userData.referral_code || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Account Status:</span>
                  <span
                    className={`badge ${
                      userData.accountStatus === "Good"
                        ? "badge-success"
                        : "badge-error"
                    } text-white`}
                  >
                    {userData.accountStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStatusModal(true)}
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Update Account Status
              </button>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-6">
              {/* Wallet Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Wallet Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Balance:</span>
                    <span>
                      ${userData.wallet?.balance?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Transactions:</span>
                    <span>{userData.wallet?.transactions?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Ride Statistics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Ride Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Completed Rides:</span>
                    <span>{userData.RideDetails?.completedRides || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Cancelled Rides:</span>
                    <span>{userData.RideDetails?.cancelledRides || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <p className="text-gray-600">
                  Location data not available
                  {/* Example if you add location to schema: */}
                  {/* {userData.location || "Not specified"} */}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetails;
