import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactPage: false,
  changeCurrentUser: undefined,
  getMessages: undefined,
  socket: undefined,
  onlineUser: undefined,
  contactsList: undefined,
  searchMessagePage: false,
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
  searchMessageId: null,
  searchMessageIdTemp: null,
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
    setAddMessages(state, action = {}) {
      if (state.getMessages) {
        state.getMessages = [...state.getMessages, action.payload];
      } else {
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
    setSearchMessagePage(state, action) {
      state.searchMessagePage = !state.searchMessagePage;
    },
    setVideoCall(state, action) {
      state.videoCall = action.payload;
    },
    setVoiceCall(state, action) {
      state.voiceCall = action.payload;
    },
    setIncomingVoiceCall(state, action) {
      state.incomingVoiceCall = action.payload;
    },
    setIncomingVideoCall(state, action) {
      state.incomingVideoCall = action.payload;
    },
    setEndCall(state, action) {
      state.incomingVideoCall = undefined;
      state.incomingVoiceCall = undefined;
      state.voiceCall = undefined;
      state.videoCall = undefined;
    },
    setSearchMessageId(state, action) {
      state.searchMessageId = action.payload;
    },
    setSearchMessageIdTemp(state, action) {
      state.searchMessageIdTemp = action.payload;
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

export const {setIncomingVideoCall, setEndCall, setSearchMessageIdTemp,setIncomingVoiceCall, setVoiceCall, setSearchMessageId, setVideoCall, setContactsList, setOnlineUser, setUserInfo, setNewUser, setContactPage, setChangeCurrentUser, setMessages, setSocket, setAddMessages, setSearchMessagePage } = authSlice.actions;

export default authSlice.reducer;