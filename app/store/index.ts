import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import sessionSlice from './sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
