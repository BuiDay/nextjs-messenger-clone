import React, { use, useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo, setMessages, setAddMessages, setSocket } from '../redux/auth/authSlice'
import Chat from "./Chat/Chat";
import socketIOClient from 'socket.io-client'

function Main() {
  const [redirectLogin, setRedirecLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const { userInfo, changeCurrentUser,getMessages } = useSelector((state) => state.auth)
  const router = useRouter();
  const dispatch = useDispatch();

  const socketRef = useRef();
  const socket = {...socketRef};

  useEffect(() => {
    if (redirectLogin) router.push('/login');
  }, [redirectLogin])

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirecLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email
      })
      if (!data.status) {
        router.push('/login')
      }
      dispatch(setUserInfo({
        id: data.data?.id,
        name: data.data?.name,
        email: data.data?.email,
        profileImage: data.data?.profilePicture,
        status: data.data?.about
      }))
    }
  })

  useEffect(() => {
    try {
      socket.current = socketIOClient.connect(HOST);
      if (userInfo) {
        socket.current.emit("add-user", userInfo.id)
        dispatch(setSocket(socket));
      }
      return () => socket.current.disconnect();
    } catch (error) {
      console.log(error)
    }
  }, [userInfo])

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        dispatch(setAddMessages({
          ...data.message
        }))
      })
    }
  })

  useEffect(() => {
    if (changeCurrentUser) {
      const getMessages = async () => {
        const { data } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${changeCurrentUser?.id}`)
        dispatch(setMessages(data.messages))
      }
      getMessages();
    }
  }, [changeCurrentUser])

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full over">
      <ChatList />
      {
        changeCurrentUser ? <Chat /> : <Empty />
      }
    </div>
  )
}

export default Main;
