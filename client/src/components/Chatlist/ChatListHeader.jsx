import React from "react";
import Avatar from "../common/Avatar";
import {useDispatch, useSelector} from "react-redux";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs'
import { setContactPage } from "@/redux/auth/authSlice";

function ChatListHeader() {
  const {userInfo, newUser,contactPage} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  const handleNewChat = () =>{
    dispatch(setContactPage(true))
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage}/>
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" title="New Chat" onClick={handleNewChat}/>
        <div>
          <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="Menu"/>
        </div>
      </div>
    </div>
  )
}

export default ChatListHeader;
