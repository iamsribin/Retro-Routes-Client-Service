enum ApiEndpoints {
  // Authentication APIs - User Service
  USER_LOGIN = '/user/login',
  USER_REGISTER = '/register',
  USER_VERIFY_EMAIL = '/user/verify-email',
  USER_REFRESH_TOKEN = '/user/refresh-token',
  USER_LOGOUT = '/user/logout',
  USER_CHECK_GOOGLE_LOGIN ="/checkGoogleLoginUser",

  RESENT_OTP = "/resendOtp",

  // Authentication APIs - Driver Service
  DRIVER_LOGIN = '/driver/login',
  DRIVER_SIGNUP = '/driver/signup',


  // User APIs - User Service
  USER_PROFILE = '/user/profile',
  USER_HOME = '/user/home',
  USER_CHECK_LOGIN = "/checkLoginUser",

  // Driver APIs - Driver Service
  DRIVER_DASHBOARD = '/driver/dashboard',
  DRIVER_PROFILE = '/driver/profile',
  DRIVER_IDENTIFICATION = '/identification',
  DRIVER_INSURANCE = '/insuranceDetails',
  DRIVER_LOCATION = "/location",
  DRIVER_CHECK_GOOGLE_LOGIN = "/checkGoogleLoginDriver",
  DRIVER_CHECK_LOGIN = "/checkLoginDriver",
  DRIVER_UPLOAD_IMAGE = "/uploadDriverImage",
  DRIVER_ADD_VEHICLE_DETAILS = "/vehicleDetails",
  DRIVER_REGISTER = "/registerDriver",
  DRIVER_RESUBMISSION = "/resubmission",
  DRIVER_ONLINE_STATUS = "/driverOnlineStatus",

  // Admin APIs - Admin Service
  ADMIN_VERIFIED_DRIVERS = "/verifiedDrivers",
  ADMIN_PENDING_DRIVERS ="/pendingDrivers",
  ADMIN_BLOCKED_DRIVERS ="/blockedDrivers",
  ADMIN_UPDATE_DRIVER_STATUS = "/driver/verify/",
  ADMIN_DRIVER_DETAILS = "/driverDetails",

  ADMIN_DASHBOARD = '/admin/dashboard',

  ADMIN_UPDATE_USER_STATUS = "/updateUserStatus",
  ADMIN_ACTIVE_USERS = "/getActiveUserData",
  ADMIN_BLOCKED_USERS = "/blockedUserData",

  ADMIN_USER_DETAILS = '/userData',
  ADMIN_DRIVERS = '/admin/drivers',
  }

export default ApiEndpoints;