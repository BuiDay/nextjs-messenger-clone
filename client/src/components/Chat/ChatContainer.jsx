import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";

function ChatContainer() {
  const { getMessages, changeCurrentUser } = useSelector((state) => state.auth);

  const messagesEndRef = createRef()

  const scrollToBottom = () => {
    const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
    messagesEndRef.current.scrollTo(0, scroll);
  }

  useEffect(() => {
    scrollToBottom()
  },[getMessages]);

  return (
    <div className="h-[83vh] w-full relative flex-grow custom-srcollbar overflow-auto"  ref={messagesEndRef}>
      <div className="bg-fixed h-full w-full top-0 left-0 z-0">
        <div className="flex w-full p-5 ">
          <div className="flex flex-col w-full gap-3">
            {
              getMessages && getMessages?.map((message, index) => {
                return (
                  <div key={message?.id} className={`flex ${(message?.senderId === changeCurrentUser?.id) ? "justify-start" : "justify-end"}`}>
                    {message.type === 'text' && (
                      <div className={`text-white px-3 py-[7px] text-md rounded-md flex gap-2 items-center ${message?.senderId === changeCurrentUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                        <span className="break-all">{message.message}</span>
                        <div className="flex gap-1 items-end">
                          <span className="text-bubble-meta text-[14px] min-w-fit">
                            {calculateTime(message.createdAt)}
                          </span>
                          <span>
                            {
                              message?.senderId !== changeCurrentUser?.id &&
                              <MessageStatus messageStatus={message.messageStatus} />
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer;
