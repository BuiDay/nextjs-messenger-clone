import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
import ContactsList from "./ContactsList";

function ChatList() {
  const { contactPage } = useSelector((state) => state.auth);
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactPage) {
      setPageType('all-contacts');
    } else {
      setPageType('default');
    }
  }, [contactPage])

  return (
    <div className="bg-panel-header-background border-r flex flex-col max-h-screen h-full z-20">
      {
        pageType === 'default' && (
          <>
            {/* <audio id="audio" autoPlay><source src="../public/call-sound.mp3" type="audio/mp3"></source></audio> */}
            <ChatListHeader />
            <SearchBar />
            <List />
          </>
        )
      }
      {
         pageType === 'all-contacts' && (
          <>
            <ContactsList />
          </>
         )
      }
    </div>
  )
}

export default ChatList;
