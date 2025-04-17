enum ApiEndpoints {
  // Authentication APIs - User Service
  USER_LOGIN = '/user/login',
  USER_SIGNUP = '/user/signup',
  USER_VERIFY_EMAIL = '/user/verify-email',
  USER_REFRESH_TOKEN = '/user/refresh-token',
  USER_LOGOUT = '/user/logout',

  // Authentication APIs - Driver Service
  DRIVER_LOGIN = '/driver/login',
  DRIVER_SIGNUP = '/driver/signup',
  DRIVER_RESUBMISSION = '/driver/resubmission',

  // User APIs - User Service
  USER_PROFILE = '/user/profile',
  USER_HOME = '/user/home',

  // Driver APIs - Driver Service
  DRIVER_DASHBOARD = '/driver/dashboard',
  DRIVER_PROFILE = '/driver/profile',

  // Admin APIs - Admin Service
  ADMIN_DASHBOARD = '/admin/dashboard',
  ADMIN_USERS = '/admin/users',
  ADMIN_USER_DETAILS = '/admin/users/',
  ADMIN_DRIVERS = '/admin/drivers',
  ADMIN_PENDING_DRIVER_DETAILS = '/admin/drivers/pending/',
  ADMIN_DRIVER_DETAILS = '/admin/drivers/',
}

export default ApiEndpoints;