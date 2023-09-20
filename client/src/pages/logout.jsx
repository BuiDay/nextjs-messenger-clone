import React, { useEffect } from "react";
import {firebaseAuth} from '../utils/FirebaseConfig'
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setChangeCurrentUser, setUserInfo } from "@/redux/auth/authSlice";

function logout() {
  const dispatch = useDispatch();
  const { socket,userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(()=>{
    console.log(socket)
    socket.current.emit("sigout", userInfo.id)
    dispatch(setUserInfo(undefined));
    dispatch(setChangeCurrentUser(undefined));
    signOut(firebaseAuth);
    router.push('/login')
  },[socket])
  return <div className="bg-conversation-panel-background h-screen"></div>;
}

export default logout;
