// src/services/emailSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for the email slice
interface EmailState {
  email: string | null;
}

const initialState: EmailState = {
  email: null,
};

// Create the slice
const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    // Action to set the email
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    // Action to clear the email
    clearEmail(state) {
      state.email = null;
    },
  },
});

// Export actions
export const { setEmail, clearEmail } = emailSlice.actions;

// Export reducer
export default emailSlice.reducer;
