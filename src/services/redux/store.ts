
import { configureStore } from "@reduxjs/toolkit";
import {persistStore,persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import storage from "redux-persist/lib/storage";

import { userAuthSlice } from "./slices/userAuthSlice";

const userPersistConfig={key:"userAuth",storage,version:1}
const driverPersistConfig={key:"driverAuth",storage,version:1}
const adminPersistConfig={key:"adminAuth",storage,version:1}

const userAuthPersistReducer=persistReducer(userPersistConfig,userAuthSlice.reducer)


export const store=configureStore({
    reducer:{
        user:userAuthPersistReducer,
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

export const persistor=persistStore(store)
