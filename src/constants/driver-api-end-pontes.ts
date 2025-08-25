enum DriverApiEndpoints {
  CHECK_REGISTER_DRIVER = "/checkRegisterDriver",
  DRIVER_REGISTER = "/registerDriver",
  DRIVER_IDENTIFICATION = "/identification",
  DRIVER_ADD_VEHICLE_DETAILS = "/vehicleDetails",
  DRIVER_DASHBOARD = "/driver/dashboard",
  DRIVER_PROFILE = "/driver/profile",
  DRIVER_LOCATION = "/location",
  DRIVER_CHECK_GOOGLE_LOGIN = "/checkGoogleLoginDriver",
  DRIVER_CHECK_LOGIN = "/checkLoginDriver",
  DRIVER_UPLOAD_IMAGE = "/uploadDriverImage",
  DRIVER_RESUBMISSION = "/resubmission",
  DRIVER_ONLINE_STATUS = "/driverOnlineStatus",
  DRIVER_INSURANCE = "/insuranceDetails",
  HANDLE_ONLINE_CHANGE = "/handle-online-change",
  GET_MY_PROFILE = "/get-driver-profile",
  UPDATE_DRIVER_PROFILE = `/update-driver-profile`,
  GET_MY_DOCUMENTS = "/get-my-documents",
  UPDATE_DRIVER_DOCUMENTS = "/update-driver-documents",
  GET_MY_TRIPS = `/getMyTrips`,
  GET_MY_TRIP_DETAILS = "/getMyTripDetails",
  UPLOAD_CHAT_FILE ="/uploadChatFile"
}

export default DriverApiEndpoints;
