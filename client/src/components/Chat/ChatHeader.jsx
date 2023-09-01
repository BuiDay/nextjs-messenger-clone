import React from "react";
import Avatar from "../common/Avatar";
import {MdCall} from 'react-icons/md'
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";

function ChatHeader() {
  const {changeCurrentUser,onlineUser} = useSelector((state)=>state.auth);

  return(
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
          <Avatar type="sm" image={`${changeCurrentUser?.profilePicture || "/default_avatar.png "}`} />
          <div className="flex flex-col">
            <span className="text-primary-strong">{changeCurrentUser?.name}</span>
            <span className="text-secondary text-sm">{onlineUser.includes((changeCurrentUser.id).toString())? 
            <div className="flex items-center gap-1">
              <div className="h-[10px] w-[10px] rounded-full bg-icon-green">  </div>
              <div>Online</div>
            </div> 
            : "Offline"}
            </span>
          </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon cursor-pointer text-xl"/>
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl"/>
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl"/>
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl"/>
      </div>
    </div>
  )
}

export default ChatHeader;
