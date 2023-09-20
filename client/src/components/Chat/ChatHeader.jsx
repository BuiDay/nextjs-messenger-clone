import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from 'react-icons/md'
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setChangeCurrentUser, setSearchMessagePage, setVideoCall, setVoiceCall } from "@/redux/auth/authSlice";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const dispatch = useDispatch();
  const { changeCurrentUser, onlineUser } = useSelector((state) => state.auth);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX - 50, y: e.pageY + 30 });
    setIsContextMenuVisible(true)
    console.log(isContextMenuVisible)
  }
  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async () => {
        setIsContextMenuVisible(false);
        dispatch(setChangeCurrentUser(undefined))
      }
    }
  ];

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
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={`${changeCurrentUser?.profilePicture || "/default_avatar.png "}`} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{changeCurrentUser?.name}</span>
          <span className="text-secondary text-sm">{onlineUser?.onlineUsers.includes((changeCurrentUser.id).toString()) ?
            <div className="flex items-center gap-1">
              <div className="h-[10px] w-[10px] rounded-full bg-icon-green"></div>
              <div>Online</div>
            </div>
            : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex justify-center items-center rounded-full p-2 transition-all shadow-lg cursor-pointer hover:bg-gray-700" onClick={handleVoiceCall}>
          <MdCall className="text-panel-header-icon text-xl" />
        </div>
        <div className="flex justify-center items-center rounded-full p-2 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={handleVideoCall}>
          <IoVideocam className="text-panel-header-icon text-xl" />
        </div>
        <div className="flex justify-center items-center rounded-full p-2 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={() => handleClick()}>
          <BiSearchAlt2 className="text-panel-header-icon text-xl" />
        </div>
        <div id="context-opener" className="flex justify-center items-center rounded-full h-[10px] w-[10px] shadow-lg transition-all cursor-pointer hover:bg-gray-700" onClick={(e) => showContextMenu(e)}>
          <BsThreeDotsVertical  className="text-panel-header-icon text-xl" />
        </div>
        {
          isContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinates={contextMenuCordinates} setContextMenu={setIsContextMenuVisible} />
        }
      </div>
    </div>
  )
}

export default ChatHeader;
