import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: __DEV__,
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
