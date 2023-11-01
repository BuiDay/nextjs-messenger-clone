import React, { use, useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo, setMessages, setAddMessages, setSocket, setIncomingVideoCall, setIncomingVoiceCall, setEndCall, setOnlineUser } from '../redux/auth/authSlice'
import Chat from "./Chat/Chat";
import socketIOClient from 'socket.io-client'
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const [redirectLogin, setRedirecLogin] = useState(false);
  const { userInfo, changeCurrentUser,reaction, searchMessagePage, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall } = useSelector((state) => state.auth)
  const router = useRouter();
  const dispatch = useDispatch();

  const socketRef = useRef();
  const socket = { ...socketRef};

  useEffect(() => {
    if (redirectLogin) router.push('/login');
  }, [redirectLogin])

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser){
      setRedirecLogin(true);
    } 
    if (!userInfo && currentUser?.email) {
      try {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: currentUser.email
        })
        if(data.status){
          dispatch(setUserInfo({
            id: data.data?.id,
            name: data.data?.name,
            email: data.data?.email,
            profileImage: data.data?.profilePicture,
            status: data.data?.about
          }))
        }else{
          router.push('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    try {
      socket.current = socketIOClient.connect(HOST);
      if (userInfo) {
        socket.current.emit("add-user", userInfo?.id)
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

      socket.current.on('incoming-voice-call', ({ from, roomId, callType }) => {
        dispatch(setIncomingVoiceCall({
          ...from,
          roomId,
          callType
        }))
      })

      socket.current.on('incoming-video-call', ({ from, roomId, callType }) => {
        dispatch(setIncomingVideoCall({
          ...from,
          roomId,
          callType
        }))
      })

      socket.current.on('voice-call-rejected', (data) => {
        dispatch(setEndCall())
      })

      socket.current.on('video-call-rejected', () => {
        dispatch(setEndCall())
      })

      socket.current.on('online-users', (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers))
      })
  
      socket.current.on("reaction-message-recieve", (data) => {
        dispatch(setMessages(data.message))
      })

      socket.current.on('online-users', (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers))
      })
    }
  })

  useEffect(() => {
    try{
      if (changeCurrentUser) {
        const getMessages = async () => {
          const { data } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${changeCurrentUser?.id}`)
          if(data){
            dispatch(setMessages(data.messages))
          }
        }
        getMessages();
      }
    }catch(error){
      console.log(error)
    }
   
  }, [changeCurrentUser])

  return (
    <>
      {
        incomingVideoCall && <IncomingVideoCall />
      }
      {
        incomingVoiceCall && <IncomingCall />
      }
      {
        videoCall && (
          <div className="h-screen w-screen max-h-full overflow-hidden">
            <VideoCall />
          </div>
        )
      }
      {
        voiceCall && (
          <div className="h-screen w-screen max-h-full overflow-hidden">
            <VoiceCall />
          </div>
        )
      }
      {
        !videoCall && !voiceCall && (
          <div className="md:grid md:grid-cols-main h-screen w-screen max-h-screen max-w-full over">
            <div className="md:block hidden h-full">
              <ChatList />
            </div>

             
              {
                 !changeCurrentUser && 
                 <div className="md:hidden block h-full">
                    <ChatList />
                 </div>
              }
               
              
            {
              changeCurrentUser ? (
                <div className={searchMessagePage ? "grid grid-cols-2" : "grid-cols-2"}>
                  <Chat />
                  {
                    searchMessagePage && <SearchMessages />
                  }
                </div>
              )
                : <Empty />
            }
          </div>
        )
      }
    </>
  )
}

export default Main;
