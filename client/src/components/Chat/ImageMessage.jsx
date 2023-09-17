import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, createRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const { getMessages, changeCurrentUser, userInfo } = useSelector((state) => state.auth);
  
  return (
    <div className={`pt-2 px-2 pb-1 rounded-lg ${message.senderId === changeCurrentUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>
      <div className="">
        <Image src={`${HOST}/${message.message}`} alt="asset" width={300} height={300} />
      </div>
      <div className="bottom-1 right-1 flex items-end justify-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {
              calculateTime(message.createdAt)
            }
          </span>
          <span className="text-white">
              {
                message?.senderId !== changeCurrentUser?.id && <MessageStatus messageStatus={message.messageStatus}/>
              }
            </span>
        </div>
    </div>
  )
}

export default ImageMessage;
