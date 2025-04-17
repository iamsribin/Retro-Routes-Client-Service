enum AppRoutes {
    // Authentication Routes - User
    USER_LOGIN = 'login',
    USER_SIGNUP = 'signup',
    USER_HOME = '',

    // Authentication Routes - Driver
    DRIVER_LOGIN = 'driver/login',
    DRIVER_SIGNUP = 'driver/signup',
    DRIVER_IDENTIFICATION = 'driver/identification',

    // Driver Routes
    DRIVER_DASHBOARD = 'driver/dashboard',

    // Admin Routes
    ADMIN_DASHBOARD = 'admin/dashboard',
    ADMIN_USERS = 'admin/users',
    ADMIN_USER_DETAILS = 'admin/userDetails/:id',
    ADMIN_PENDING_DRIVER_DETAILS = 'admin/PendingDriverDetails/:id',
    ADMIN_DRIVER_DETAILS = 'admin/driverDetails/:id',
    ADMIN_DRIVERS = 'admin/drivers',
}

export default AppRoutes;