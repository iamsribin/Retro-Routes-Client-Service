export enum AdminApiEndpoints {
  BASE = "/admin",

  // Vehicles
  VEHICLE_MODELS = "/admin/vehicle-models",           // GET, POST
  VEHICLE_MODEL = "/admin/vehicle-models/:id",        // GET, PATCH, DELETE

  // Drivers
  DRIVERS = "/admin/drivers",                         // GET (list), POST (create)
  DRIVER = "/admin/drivers/:driverId",               // GET (details), PATCH (update), DELETE
  DRIVER_STATUS = "/admin/drivers/:driverId/status", // PATCH (change status e.g. verify/block)
  DRIVER_VERIFICATIONS = "/admin/drivers/:driverId/verifications", // POST for verification attempts

  // Users
  USERS = "/admin/users",                            // GET (list)
  USER = "/admin/users/:userId",                     // GET, PATCH
  USER_STATUS = "/admin/users/:userId/status",       // PATCH

  // Dashboard / aggregated
  DASHBOARD = "/admin/dashboard",                    // GET (summary metrics)
}
