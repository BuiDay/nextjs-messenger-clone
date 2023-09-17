import { CONTACTS_LIST_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setContactPage } from "@/redux/auth/authSlice";
import { BiSearchAlt2 } from 'react-icons/bi'
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [allContact, setAllContact] = useState([]);

  useEffect(() => {
    const getContactsList = async () => {
      try {
        const { data } = await axios.get(CONTACTS_LIST_ROUTE)
        if (data.status) {
          setAllContact(data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getContactsList();
  }, [])

  const handleBackChatList = () => {
    dispatch(setContactPage(false))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-center px-3 py-5">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack className="text-panel-header-icon cursor-pointer text-xl" onClick={handleBackChatList} />
          <span>New chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-srcollbar">
          <div className="flex py-2 items-center gap-3 h-14">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-3">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" title="Search" />
              </div>
              <div>
                <input type="text" placeholder="Search contracts" className="bg-transparent text-sm focus:outline-none text-white w-full" />
              </div>
            </div>
          </div>
          {
            Object.entries(allContact).map(([initialLetter,userList])=>{
              const newUserList  = userList.filter((item)=> item.id !== userInfo.id)
              return(
                <div key={Date.now()+initialLetter}>
                  <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
                  {
                    newUserList.map(item=>{
                      return <ChatLIstItem 
                        data={item}
                        isContactPage = {true}
                        key={item.id}
                      />
                    })
                  }
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default ContactsList;
