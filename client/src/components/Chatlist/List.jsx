import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {GET_INITIAL_CONTACT_ROUTE} from '../../utils/ApiRoutes'
import { setContactsList, setOnlineUser } from "@/redux/auth/authSlice";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const { userInfo, contactsList, getMessages} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(userInfo){
      const getContactsList = async ()=> {
          const {data:{data}} = await axios.get(`${GET_INITIAL_CONTACT_ROUTE}/${userInfo.id}`)
          const {user, onlineUsers} = data;
          if(user && onlineUsers){
            dispatch(setOnlineUser(onlineUsers))
            dispatch(setContactsList(user))
          }
      } 
      getContactsList();
    }
  },[userInfo, getMessages])

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-srcollbar">
      {
        contactsList && contactsList.map((contact)=>
          <ChatLIstItem data = {contact} />
        )
      }
    </div>
  )
}

export default List;
