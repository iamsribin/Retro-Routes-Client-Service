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
    GET_MY_TRIP_DETAILS = "me/trips",

    // Driver Routes
    RIDE_TRACKING="ride-tracking",
    // Admin Routes
    ADMIN_USERS = 'users',
    ADMIN_USER_DETAILS = 'user/:id',
    ADMIN_PENDING_DRIVER_DETAILS = 'PendingDriverDetails',
    ADMIN_DRIVERS = 'drivers',
    //admin navigate
    ADMIN_DRIVER_DETAILS = '/admin/drivers/:id',
}

export default AppRoutes;