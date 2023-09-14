import { ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import dynamic from 'next/dynamic';
import axios from "axios";
import React, { useState,useRef, useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { setAddMessages } from '../../redux/auth/authSlice'
import { useSelector, useDispatch } from "react-redux";

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

function MessageBar() {
  const { userInfo, changeCurrentUser, socket } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const EmojiModalRef = useRef(null);
  const [isShowEmojiModal, setIsShowEmojiModal] = useState(false);
  const dispatch = useDispatch();


  const handleSetMessages = (text) => {
      setMessage(text)
  }

  const handleEmojiModal = () => {
    setIsShowEmojiModal(!isShowEmojiModal);
  }

  const handleEmojiClick = (emoji) => {
    if(emoji){
        setMessage((pre)=>pre += emoji.emoji)
    }
  }
  
  useEffect (()=>{
    const handleShow = (e) => {
      if(e.target.id !== "EmojiModal"){
        if(EmojiModalRef.current && !EmojiModalRef.current.contains(e.target)){
          setIsShowEmojiModal(false)
        }
      }
    } 
    document.addEventListener('click',(e)=>handleShow(e))
    return document.removeEventListener('click',(e)=>handleShow(e))
  },[])

  const handleSendMessages = async () => {
    try {
      if (message) {
        const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
          to: changeCurrentUser.id,
          from: userInfo.id,
          message
        })
        socket.current.emit("send-msg", {
          to: changeCurrentUser.id,
          from: userInfo.id,
          message: data.message
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
          <BsEmojiSmile 
                        onClick={handleEmojiModal} 
                        id="EmojiModal"
                        className="text-panel-header-icon cursor-pointer text-xl" />
          {
            isShowEmojiModal && (
              <div ref={EmojiModalRef} className="absolute bottom-24 left-16 z-40">
                <Picker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )
          }
          <ImAttachment className="text-panel-header-icon cursor-pointer text-xl" />
        </div>
        <div className="w-full rounded-lg h-[60px] flex items-center">
          <input type="text" placeholder="Type a messages" value={message} className="bg-input-background text-sm focus:outline-none text-white rounded-lg p-4 w-full" onChange={(e) => handleSetMessages(e.target.value)} />
        </div>
        <div className="flex w-20 items-center justify-center gap-6">
          <MdSend className="text-panel-header-icon cursor-pointer text-xl" onClick={() => handleSendMessages()} />
          <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" />
        </div>
      </div>
    </div>
  )
}

export default MessageBar;
