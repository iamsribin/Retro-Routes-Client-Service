enum ApiEndpoints {
  // Authentication APIs - User Service
  USER_LOGIN = '/user/login',
  USER_REGISTER = '/register',
  USER_VERIFY_EMAIL = '/user/verify-email',
  USER_REFRESH_TOKEN = '/user/refresh-token',
  USER_LOGOUT = '/user/logout',
  USER_CHECK_GOOGLE_LOGIN ="/checkGoogleLoginUser",
  CHECK_USER ='/checkUser',
  RESENT_OTP = "/resendOtp",

  UPLOAD_CHAT_FILE = "/uploadChatFile",
  // Authentication APIs - Driver Service
  DRIVER_LOGIN = '/driver/login',
  DRIVER_SIGNUP = '/driver/signup',


  // User APIs - User Service
  USER_PROFILE = '/user/profile',
  USER_HOME = '/user/home',
  USER_CHECK_LOGIN = "/checkLoginUser",
  BOOK_MY_CAB="/book-my-cab",

  // Driver APIs - Driver Service

  ADMIN_VEHICLE_MODELS = "/vehicleModels",
  // Admin APIs - Admin Service
  ADMIN_GET_DRIVERS = "/get-drivers-list",
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