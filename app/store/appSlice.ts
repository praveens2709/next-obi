import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface AppState {
  sessionId: string;
  cartItemId: number;
  orderId: string | null;
}

const initialState: AppState = {
  sessionId: '',
  cartItemId: 0,
  orderId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    setCartItemId(state, action: PayloadAction<number>) {
      state.cartItemId = action.payload;
    },
    setOrderId(state, action: PayloadAction<string | null>) {
      state.orderId = action.payload;
    },
  },
});

export const { setSessionId, setCartItemId, setOrderId } = appSlice.actions;

export const selectSessionId = (state: RootState) => state.app.sessionId;
export const selectCartItemId = (state: RootState) => state.app.cartItemId;
export const selectOrderId = (state: RootState) => state.app.orderId;

export default appSlice.reducer;
