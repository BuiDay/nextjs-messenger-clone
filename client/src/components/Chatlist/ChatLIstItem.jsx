import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setChangeCurrentUser, setContactPage, setUserInfo } from "@/redux/auth/authSlice";
import { calculateTime } from "@/utils/CalculateTime";
import { userAgent } from "next/server";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({ data, isContactPage = false }) {

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth)

  const handleContactClick = () => {
    console.log(data)
    dispatch(setChangeCurrentUser(data))
    dispatch(setContactPage(false))
  }


  return (
    <div className="flex cursor-pointer items-center hover:bg-background-default-hover" onClick={handleContactClick}>
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?.profilePicture || "/default_avatar.png"} />
      </div>
      <div className="min-h-full flex flex-col mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <span className="text-white">{data?.name}</span>
          {
            !isContactPage && (
              <div>
                <span className={`${!data.totalUnreadMessages > 0 ? "text-secondary" : "text-icon-green"} text-sm`}>
                  {
                    calculateTime(data.createdAt)
                  }
                </span>
              </div>
            )
          }
        </div>

        <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? data?.about : (
                <div className="flex items-center gap-1 max-w-[200px]
                              sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px]
                              xl:max-w-[300px]
              ">
                  {
                    data.senderId === userInfo.id && <MessageStatus messageStatus={data.messageStatus} />
                  }
                  {
                    data.type === "text" && <span className="truncate">{data.message}</span>
                  }
                  {
                    data.type === "audio" && 
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  }
                   {
                    data.type === "image" && 
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" />
                      Image
                    </span>
                  }
                </div>
              )}
            </span>
            {
              data.totalUnreadMessages > 0 &&
              <span className="bg-icon-green text-white flex items-center text-sm justify-center center h-[20px] w-[20px] rounded-full">{data.totalUnreadMessages}</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLIstItem;
