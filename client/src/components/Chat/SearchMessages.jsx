import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { setSearchMessagePage, setSearchMessageId } from "@/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiSearchAlt2 } from 'react-icons/bi'
import { calculateTime } from "@/utils/CalculateTime";
function SearchMessages() {
  const { changeCurrentUser, getMessages } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);
  const dispatch = useDispatch();
  const handleClick = () => {
    setSearchTerm("");
    setSearchedMessages([]);
    dispatch(setSearchMessagePage());
    dispatch(setSearchMessageId(null))
  }

  const handleMessageId = (id) => {
    const messageId = "message" + " " + id.toString();
    dispatch(setSearchMessageId(messageId))
  }

  useEffect(() => {
    if (searchTerm) {
      const searchTermm = getMessages.filter((item) => item.message.includes(searchTerm));
      setSearchedMessages(searchTermm);
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm])

  return (
    <div className="border-white border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() => handleClick()}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-srcollbar h-full">
        <div className="flex items-center flex-col w-full mt-1">
          <div className="flex px-3 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-3">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" title="Search" />
              </div>
              <div>
                <input type="text" placeholder="Search message"
                  className="bg-transparent p-1 text-md focus:outline-none text-white w-full"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
          <span className="mt-5 text-secondary">
            {
              !searchTerm.length && `Search for messages with ${changeCurrentUser?.name}`
            }
          </span>
        </div>
        <div className="flex justify-center">
          {
            searchTerm.length > 0 && !searchedMessages.length > 0 && <span className="text-secondary">No messages found</span>
          }
        </div>
        <div className="flex flex-col w-full">
          {
            searchedMessages.map((message) => {
              return (
                <>
                  {
                    message.type === 'text' && (
                      <div className={`flex flex-col justify-center ${(message?.senderId === changeCurrentUser?.id) ? "items-start" : "items-end"} w-full px-2 pb-2 cursor-pointer`} onClick={() => handleMessageId(message.id)}>
                        <div className="text-sm text-secondary">{calculateTime(message.createdAt)}</div>
                        <div className={` text-white px-3 py-[7px] text-md rounded-md flex gap-2 items-center ${message?.senderId === changeCurrentUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                          <div className="text-white">{message.message}</div>
                        </div>
                      </div>
                    )
                  }
                </>

              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
