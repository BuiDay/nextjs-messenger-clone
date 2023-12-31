import { configureStore} from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./rootReducer";

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });


export const wrapper = createWrapper(makeStore);