import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentId: 1, toasts: [], removeTimeoutNotSet: [] };

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    newToast(state, action) {
      const { msg, type } = action.payload;
      return {
        currentId: state.currentId + 1,
        toasts: state.toasts.concat({
          id: state.currentId,
          content: msg || 'tapahtui selittämätön virhe',
          type: type || 'error',
        }),
        removeTimeoutNotSet: state.removeTimeoutNotSet.concat(state.currentId),
      };
    },
    removeToast(state, action) {
      return {
        currentId: state.currentId,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
        removeTimeoutNotSet: state.removeTimeoutNotSet,
      };
    },
    toastTimeoutsSet(state, action) {
      return {
        currentId: state.currentId,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
        removeTimeoutNotSet: state.removeTimeoutNotSet.filter(id => !action.payload.includes(id)),
      };
    },
  },
});

export const { newToast, removeToast, toastTimeoutsSet } = toastSlice.actions;
export default toastSlice.reducer;
