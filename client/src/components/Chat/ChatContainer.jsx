import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, createRef, useState, useRef, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import { BsThreeDots, BsEmojiSmile } from 'react-icons/bs'
import ReactionMenu from "../common/ReactionMenu";
import dynamic from "next/dynamic";
import { setSearchMessageIdTemp } from "@/redux/auth/authSlice";

const VoiceMessage = dynamic(
  () => {
    return import("./VoiceMessage");
  },
  { ssr: false }
);
const reacttionMenuList = [
  {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png",
    title: "heart"
  },
  {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f606.png",
    title: "laughing"
  }, {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png",
    title: "cry"
  }
  , {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62e.png",
    title: "open mouth"
  }
  , {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f623.png",
    title: "persevere"
  }
  , {
    img: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
    title: "pray"
  }
]

function ChatContainer() {
  const { getMessages, changeCurrentUser, searchMessageId,searchMessageIdTemp } = useSelector((state) => state.auth);
  const messagesEndRef = createRef()
  const reactionMenuRef = useRef(null)
  const [isShowReactionMenu, setIsShowReactionMenu] = useState(false)
  const [isChatId, setIsChatId] = useState()
  const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const handleReactionMenu = (event, id) => {
    event.preventDefault();
    setIsChatId(id);
    setIsShowReactionMenu(!isShowReactionMenu);
    setContextMenuCordinates({ x: event.pageX, y: event.pageY });
  }

  const scrollToBottom = () => {
    const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
    messagesEndRef.current.scrollTo(0, scroll);
  }

  useEffect(() => {
    if(searchMessageIdTemp){
      const element = document.getElementById(`${searchMessageIdTemp}`);
      element.style.removeProperty("background-color");
    }
    if(searchMessageId){
      dispatch(setSearchMessageIdTemp(searchMessageId))
    }else{
      dispatch(setSearchMessageIdTemp(null))
    }
  }, [searchMessageId])

  useEffect(()=>{
    if(searchMessageIdTemp === searchMessageId){
      const element = document.getElementById(`${searchMessageIdTemp}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.setAttribute("style", "background-color:#B22222");
      }
    }else{
      const element = document.getElementById(`${searchMessageIdTemp}`);
      element.style.removeProperty("background-color");
    }
  },[searchMessageIdTemp])

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target?.id.includes(`reaction-menu`)) {
        if (reactionMenuRef.current && !reactionMenuRef.current.contains(event.target)) {
          setIsShowReactionMenu(false);
        }
      }
    }
    document.addEventListener('click', (e) => handleClick(e));
    return document.removeEventListener('click', (e) => handleClick(e));
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [getMessages]);

  return (
    <>
      <div className="h-[85vh] relative w-full flex-grow custom-srcollbar overflow-auto" ref={messagesEndRef}>
        <div className="bg-fixed h-full w-full top-0 left-0 z-0 ">
          <div id="chat" className="flex w-full p-5 ">
            <div className="flex flex-col w-full gap-3">
              {
                getMessages && getMessages?.map((message, index) => {
                  return (
                    <div className="relative"> 
                      <div key={message?.id} className={`chat-container flex ${(message?.senderId === changeCurrentUser?.id) ? "justify-end flex-row-reverse" : "justify-end"} items-center gap-2`}>
                        <div className={`flex gap-2 ${(message?.senderId === changeCurrentUser?.id) ? "justify-end flex-row-reverse" : "justify-end"}`}>
                          <div className="flex justify-center items-center cursor-pointer" ref={reactionMenuRef} >
                            <div className="chat-menu__icon text-white text-xl rounded-full chat-menu" onClick={(e) => handleReactionMenu(e, message?.id)}>
                              <BsEmojiSmile id={`reaction-menu_${message?.id}`} />
                            </div>
                            {
                              isShowReactionMenu && isChatId === message?.id && <ReactionMenu reacttionMenuList={reacttionMenuList} contextMenuCordinates={contextMenuCordinates} chatId={isChatId} />
                            }
                          </div>
                          <div className=" rounded-full flex justify-center items-center cursor-pointer">
                            <span className="chat-menu__icon text-white text-xl rounded-full chat-menu  ">
                              <BsThreeDots />
                            </span>
                          </div>
                        </div>
                        {message.type === 'text' && (
                          <div id={`message ${message.id}`} className={`chat-message text-white px-3 py-[7px] text-md rounded-md flex gap-2 items-center ${message?.senderId === changeCurrentUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                            <span className="break-all max-w-[400px]">{message.message}</span>
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
                        {
                          message.type === 'image' && <ImageMessage message={message} />
                        }
                        {
                          message.type === 'audio' && <VoiceMessage message={message} />
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ChatContainer;
