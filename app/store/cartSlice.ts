import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface CartState {
  cartItemId: number;
}

const initialState: CartState = {
  cartItemId: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItemId(state, action: PayloadAction<number>) {
      state.cartItemId = action.payload;
    },
    clearCartItemId(state) {
      state.cartItemId = 0;
    },
  },
});

export const { setCartItemId, clearCartItemId } = cartSlice.actions;

export const selectCartItemId = (state: RootState) => state.cart.cartItemId;

export default cartSlice.reducer;
