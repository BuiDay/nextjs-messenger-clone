import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import {useSelector, useDispatch} from "react-redux";
import {setUserInfo,setNewUser} from '../redux/auth/authSlice'

function Main() {
  const [redirectLogin, setRedirecLogin] = useState(false);
  const {userInfo, newUser} = useSelector((state)=>state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(redirectLogin) router.push('/login');
  },[redirectLogin])

onAuthStateChanged(firebaseAuth, async (currentUser)=>{
    if(!currentUser) setRedirecLogin(true);
    if(!userInfo && currentUser?.email){
      const {data} = await axios.post(CHECK_USER_ROUTE,{
        email:currentUser.email
      })
      console.log(data)
      if(!data.status){
        router.push('/login')
      }
      dispatch(setUserInfo({
        id:data.data.id,
        name:data.data.name,
        email:data.data.email,
        profileImage:data.data.profilePicture,
        status:data.data.about}))
      dispatch(setNewUser(true))
    }
  })

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full over">
      <ChatList />
      <Empty />
    </div>
  )
}

export default Main;
