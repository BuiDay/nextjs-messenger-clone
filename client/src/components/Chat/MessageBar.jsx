import { ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState } from "react";
import { BsEmojiAngry, BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import {setAddMessages} from '../../redux/auth/authSlice'
import { useSelector, useDispatch } from "react-redux";

function MessageBar() {
  const {userInfo,changeCurrentUser,socket} = useSelector((state)=>state.auth);

  const [message, setMessage] = useState ("");
  const dispatch = useDispatch();
  const handleSetMessages = (text) =>{
    if(text){
      setMessage(text)
    }
  }

  const handleSendMessages = async () => {
    try {
      if(message){
        const {data} = await axios.post(ADD_MESSAGES_ROUTE,{
          to:changeCurrentUser.id,
          from:userInfo.id,
          message
        })
        socket.current.emit("send-msg",{
          to:changeCurrentUser.id,
          from:userInfo.id,
          message:data.message
        })
        dispatch(setAddMessages({
          ...data.message
      }))
      }
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <div className="flex items-center gap-6 w-full">
        <div className="flex gap-6">
          <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl" />
          <ImAttachment className="text-panel-header-icon cursor-pointer text-xl"/> 
        </div>
        <div className="w-full rounded-lg h-[60px] flex items-center">
          <input type="text" placeholder="Type a messages" value={message} className="bg-input-background text-sm focus:outline-none text-white rounded-lg p-4 w-full" onChange={(e)=>handleSetMessages(e.target.value)}/>
        </div>
        <div className="flex w-20 items-center justify-center gap-6">
          <MdSend className="text-panel-header-icon cursor-pointer text-xl" onClick={()=>handleSendMessages()}/>
          <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl"/>
        </div>
      </div>
    </div>
  )
}

export default MessageBar;
