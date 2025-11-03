
export enum AdminApiEndpoints {
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