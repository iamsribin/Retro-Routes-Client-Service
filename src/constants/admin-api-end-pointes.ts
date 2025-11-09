export enum AdminApiEndpoints {
  BASE = "/admin",

  // Drivers
  DRIVERS = "/admin/drivers",                        
  DRIVER = "/admin/drivers/:id",   
              
  DRIVER_STATUS = "/admin/drivers/:driverId/status",
  DRIVER_VERIFICATIONS = "/admin/drivers/:driverId/verifications",

  // Users
  USERS = "/admin/users",                            
  USER = "/admin/users/:id",                     
  DASHBOARD = "/admin/dashboard",                    
}
