import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPaymentGateway } from '@/api/api-calls';

interface PaymentGateway {
    redirecturl2?: string;
}

interface PaymentGatewayState {
    redirecturl2?: string;
    error: boolean;
    loading: boolean;
}

const initialState: PaymentGatewayState = {
    redirecturl2: undefined,
    error: false,
    loading: false,
};

export const fetchPaymentGateway = createAsyncThunk(
    'paymentGateway/fetchPaymentGateway',
    async (sessionId: string, thunkAPI) => {
        try {
            const result = await getPaymentGateway(sessionId);
            console.log(result)
            console.log(result?.response)
            console.log(result?.response?.redirecturl2)
            if (result?.response?.redirecturl2) {
                return { redirecturl2: result.response.redirecturl2 };
            } else {
                return thunkAPI.rejectWithValue('No redirect URL found');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch payment gateway');
        }
    }
);

const paymentGatewaySlice = createSlice({
    name: 'paymentGateway',
    initialState,
    reducers: {
        resetPaymentGatewaySlice: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentGateway.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchPaymentGateway.fulfilled, (state, action: PayloadAction<PaymentGateway>) => {
                state.redirecturl2 = action.payload.redirecturl2;
                state.loading = false;
                state.error = false;
            })
            .addCase(fetchPaymentGateway.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export const { resetPaymentGatewaySlice } = paymentGatewaySlice.actions;

export default paymentGatewaySlice.reducer;
