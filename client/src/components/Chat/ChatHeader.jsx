import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from 'react-icons/md'
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsXLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setChangeCurrentUser, setSearchMessagePage, setVideoCall, setVoiceCall } from "@/redux/auth/authSlice";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const dispatch = useDispatch();
  const { changeCurrentUser, onlineUser } = useSelector((state) => state.auth);

  const handleClose = () =>{
    dispatch(setChangeCurrentUser(undefined))
  }
  
  const handleClick = () => {
    dispatch(setSearchMessagePage())
  }

  const handleVoiceCall = () => {
    dispatch(setVoiceCall({
      ...changeCurrentUser,
      type: "out-going",
      callType: "voice",
      roomId: Date.now()
    }))
  }

  const handleVideoCall = () => {
    dispatch(setVideoCall({
      ...changeCurrentUser,
      type: "out-going",
      callType: "video",
      roomId: Date.now()
    }))
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center md:gap-6 gap-1">
        <Avatar type="sm" image={`${changeCurrentUser?.profilePicture || "/default_avatar.png "}`} />
        <div className="flex flex-col">
          <span className="text-primary-strong" style={{whiteSpace:"nowrap"}}>{changeCurrentUser?.name}</span>
          <span className="text-secondary text-sm">{onlineUser?.onlineUsers.includes((changeCurrentUser.id).toString()) ?
            <div className="flex items-center gap-1">
              <div className="h-[10px] w-[10px] rounded-full bg-icon-green"></div>
              <div>Online</div>
            </div>
            : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex md:gap-6 gap-2">
        <div className="flex justify-center items-center rounded-full md:p-2 p-1 transition-all shadow-lg cursor-pointer hover:bg-gray-700" onClick={handleVoiceCall}>
          <MdCall className="text-panel-header-icon text-xl" />
        </div>
        <div className="flex justify-center items-center rounded-full md:p-2 p-1 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={handleVideoCall}>
          <IoVideocam className="text-panel-header-icon text-xl" />
        </div>
        <div className="flex justify-center items-center rounded-full md:p-2 p-1 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={() => handleClick()}>
          <BiSearchAlt2 className="text-panel-header-icon text-xl" />
        </div>
        <div className="flex justify-center items-center rounded-full md:p-2 p-1 shadow-lg transition-all cursor-pointer hover:bg-gray-700" onClick={() => handleClose()}>
          <BsXLg  className="text-panel-header-icon text-xl" />
        </div>
        {/* {
          isContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinates={contextMenuCordinates} setContextMenu={setIsContextMenuVisible} />
        } */}
      </div>
    </div>
  )
}

export default ChatHeader;
