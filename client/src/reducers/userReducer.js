import { createSlice } from "@reduxjs/toolkit"

const initialState = { name: "", username: "", token: "" }

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      return action.payload
    },
    logout(state) {
      return initialState
    }
  }
})

export const { loginUser, logout } = userSlice.actions
export default userSlice.reducer