import React,{useState} from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { setContactPage } from "@/redux/auth/authSlice";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";

function ChatListHeader() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter()

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
      name: "Logout",
      callback: () => {
        setIsContextMenuVisible(false);
        router.push('/logout')
      }
    }
  ];
  
  const handleNewChat = () => {
    dispatch(setContactPage(true))
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center justify-center gap-3">
        <div className="cursor-pointer">
          <Avatar type="sm" image={userInfo?.profileImage} />
        </div>
        <div className="text-white">
          <p>{userInfo?.name}</p>
          <p className="text-secondary text-sm">{userInfo?.status}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex justify-center items-center rounded-full p-2 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={handleNewChat}>
          <BsFillChatLeftTextFill className="text-panel-header-icon text-xl" title="New Chat" />
        </div>
        <div  id="context-opener"  className="flex justify-center items-center rounded-full p-2 shadow-lg transition-all cursor-pointer hover:bg-gray-700 " onClick={(e) => showContextMenu(e)}>
          <BsThreeDotsVertical className="text-panel-header-icon text-xl" />
        </div>
        {
          isContextMenuVisible && <ContextMenu options={contextMenuOptions} cordinates={contextMenuCordinates} setContextMenu={setIsContextMenuVisible} />
        }
      </div>
    </div>
  )
}

export default ChatListHeader;
