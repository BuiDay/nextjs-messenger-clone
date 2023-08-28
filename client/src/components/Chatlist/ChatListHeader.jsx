import React from "react";
import Avatar from "../common/Avatar";
import {useSelector} from "react-redux";

function ChatListHeader() {
  const {userInfo, newUser} = useSelector((state)=>state.auth);
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage}/>
      </div>
    </div>
  )
}

export default ChatListHeader;
