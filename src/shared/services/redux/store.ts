    import { configureStore } from "@reduxjs/toolkit";
    import {
    persistStore,persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
    } from 'redux-persist'
    import pendingModalSlice from "./slices/pendingModalSlice";
    import rejectModalSlice from "./slices/rejectModalSlice";
    import storage from "redux-persist/lib/storage";
    import notificationSlice from "./slices/notificationSlice";
    import { userAuthSlice } from "./slices/userAuthSlice";
    import driverAuthSlice from "./slices/driverAuthSlice";
    import adminAuthSlice from "./slices/adminAuthSlice";
    import rideSlice from "./slices/rideSlice";
    import DriverRideSlice from "./slices/driverRideSlice";
    import LoadingSlice from "./slices/loadingSlice";

    const userPersistConfig={key:"userAuth",storage,version:1}
    const driverRideMapRideMapPersistConfig={key:"DriverRideMap",storage,version:1}
    const driverPersistConfig={key:"driverAuth",storage,version:1}
    const adminPersistConfig={key:"adminAuth",storage,version:1}
    const RideMapPersistConfig={key:"RideMap",storage,version:1}
    const LoadingPersistConfig={key:"Loading",storage,version:1}

    const userAuthPersistReducer=persistReducer(userPersistConfig,userAuthSlice.reducer)
    const driverAuthPersistReducer=persistReducer(driverPersistConfig,driverAuthSlice.reducer)
    const adminAuthPersistReducer=persistReducer(adminPersistConfig,adminAuthSlice.reducer)
    const RideMapPersistReducer=persistReducer(RideMapPersistConfig,rideSlice.reducer)   
    const DriverRideMapPersistReducer=persistReducer(driverRideMapRideMapPersistConfig,DriverRideSlice.reducer)
    const LoadingPersistConfigReducer = persistReducer(LoadingPersistConfig, LoadingSlice.reducer)

    export const store=configureStore({
        reducer:{
            user:userAuthPersistReducer,
            driver:driverAuthPersistReducer,
            admin:adminAuthPersistReducer,
            pendingModal: pendingModalSlice,
            rejectModal:rejectModalSlice,
            notification: notificationSlice,
            RideMap:RideMapPersistReducer,
            driverRideMap: DriverRideMapPersistReducer,
            loading: LoadingPersistConfigReducer
        },
        middleware: (getDefaultMiddleware) => {
            const middleware = getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            });
            return middleware;
        },

    })
    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
    export const persistor=persistStore(store)