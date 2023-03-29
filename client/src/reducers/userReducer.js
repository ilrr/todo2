import { createSlice } from '@reduxjs/toolkit';

const initialState = { name: '', username: '', token: '' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser(state, action) {
      return action.payload;
    },
    logout() {
      caches.delete('list-cache');
      return initialState;
    },
  },
});

export const { loginUser, logout } = userSlice.actions;
export default userSlice.reducer;
