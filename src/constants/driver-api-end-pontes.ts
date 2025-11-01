enum DriverApiEndpoints {
  CHECK_REGISTER_DRIVER = "/driver/checkRegisterDriver",
  DRIVER_REGISTER = "/driver/registerDriver",
  DRIVER_IDENTIFICATION = "/driver/identification",
  DRIVER_ADD_VEHICLE_DETAILS = "/driver/vehicleDetails",
  DRIVER_DASHBOARD = "/driver/dashboard",
  DRIVER_PROFILE = "/driver/profile",
  DRIVER_LOCATION = "/driver/location",
  DRIVER_CHECK_GOOGLE_LOGIN = "/driver/checkGoogleLoginDriver",
  DRIVER_CHECK_LOGIN = "/driver/checkLoginDriver",
  DRIVER_UPLOAD_IMAGE = "/driver/uploadDriverImage",
  DRIVER_RESUBMISSION = "/driver/resubmission",
  DRIVER_ONLINE_STATUS = "/driver/driverOnlineStatus",
  DRIVER_INSURANCE = "/driver/insuranceDetails",
  HANDLE_ONLINE_CHANGE = "/driver/handle-online-change",
  GET_MY_PROFILE = "/driver/get-driver-profile",
  UPDATE_DRIVER_PROFILE = `/driver/update-driver-profile`,
  GET_MY_DOCUMENTS = "/driver/get-my-documents",
  UPDATE_DRIVER_DOCUMENTS = "/driver/update-driver-documents",
  GET_MY_TRIPS = `/driver/getMyTrips`,
  GET_MY_TRIP_DETAILS = "/driver/getMyTripDetails",
  UPLOAD_CHAT_FILE ="/driver/uploadChatFile",
  CHECK_SECURITY_PIN ="/driver/check-security-pin"
}

export default DriverApiEndpoints;
