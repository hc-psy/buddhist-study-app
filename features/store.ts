import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "@/features/filter/filterSlice";
import { api } from "@/features/services/api";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
