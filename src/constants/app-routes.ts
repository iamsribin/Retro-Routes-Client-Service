enum AppRoutes {
    // comment Routes
    LOGIN = 'login',
    SIGNUP = 'signup',
    USER_HOME = '',
    DASHBOARD = 'dashboard',
    PROFILE = 'profile',
    PAYMENT = "payment",
    

    // Authentication Routes - Driver
    DRIVER_IDENTIFICATION = 'identification',
    DRIVER_RESUBMISSION = 'resubmission',
    TRIPS = "trips",
    DOCUMENTS = "documents",
    GET_MY_TRIP_DETAILS = "getMyTripDetails",

    // Driver Routes
    RIDE_TRACKING="ride-tracking",
    // Admin Routes
    ADMIN_USERS = 'users',
    ADMIN_USER_DETAILS = 'userDetails',
    ADMIN_PENDING_DRIVER_DETAILS = 'PendingDriverDetails',
    ADMIN_DRIVER_DETAILS = 'driverDetails',
    ADMIN_DRIVERS = 'drivers',
}

export default AppRoutes;