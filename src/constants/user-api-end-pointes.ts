enum UserApiEndpoints {
  // Authentication APIs
  USER_LOGIN = '/user/login',
  USER_REGISTER = '/user/register',
  USER_VERIFY_EMAIL = '/user/verify-email',
  USER_REFRESH_TOKEN = '/user/refresh-token',
  USER_LOGOUT = '/user/logout',
  USER_CHECK_GOOGLE_LOGIN ="/user/checkGoogleLoginUser",
  CHECK_USER ='/user/checkUser',
  RESENT_OTP = "/user/resendOtp",
  CANCEL_RIDE ="/user/cancel-ride",
  COMPLETE_RIDE = "/user/ride-completed",
  UPLOAD_CHAT_FILE = "/user/uploadChatFile",

  // User APIs
  USER_CHECK_LOGIN = "/user/checkLoginUser",
  BOOK_MY_CAB="/user/book-my-cab",

  PROFILE = '/user/me',             
  UPDATE_AVATAR = '/user/me/avatar', 
  UPDATE_NAME = '/user/me/name',     
  HOME = '/user/home'

  }

export default UserApiEndpoints;