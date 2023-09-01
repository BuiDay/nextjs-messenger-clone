import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  userInfo:undefined,
  newUser:false,
  contactPage:false,
  changeCurrentUser:undefined,
  getMessages:undefined,
  socket: undefined,
  onlineUser:undefined,
  contactsList:undefined,
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setNewUser(state, action) {
      state.newUser = action.payload;
    },
    setContactPage(state, action) {
      state.contactPage = action.payload;
    },
    setChangeCurrentUser(state, action) {
      state.changeCurrentUser = action.payload;
    },
    setMessages(state, action) {
      state.getMessages = action.payload;
    },
    setAddMessages(state, action={}) {
      if(state.getMessages){
        state.getMessages =[...state.getMessages, action.payload];
      }else{
        state.getMessages = [action?.payload];
      }
      
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
    setOnlineUser(state, action) {
      state.onlineUser = action.payload;
    },
    setContactsList(state, action) {
      state.contactsList = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setContactsList,setOnlineUser, setUserInfo,setNewUser,setContactPage, setChangeCurrentUser, setMessages,setSocket,setAddMessages} = authSlice.actions;

export default authSlice.reducer;