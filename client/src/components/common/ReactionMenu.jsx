import React from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from "react-redux";
import { setMessages, setReaction } from '@/redux/auth/authSlice';
import axios from 'axios';
import { REACTION_MESSAGE_ROUTE } from '@/utils/ApiRoutes';

const ReactionMenu = ({ reacttionMenuList, contextMenuCordinates, chatId, setIsShowReactionMenu}) => {
    const dispatch = useDispatch();
    const { getMessages, userInfo, socket, changeCurrentUser} = useSelector((state) => state.auth)
    const handle = async (item) => {
        try {
            const newMessages = getMessages.filter((item) => item.id === chatId)
            const reactions = newMessages[0].reaction
            let newReaction
            const index = getMessages.findIndex(object => {
                return object.id === chatId});
            if(reactions[0]?.type === item.title){
                 newReaction = {
                    ...newMessages[0],
                    reaction: []
                }
            }else{
                 newReaction = {
                    ...newMessages[0],
                    reaction: [{
                        type: item.title,
                        userId: userInfo.id,
                        messageId: chatId,
                    }]
                }
            }
            const temp = getMessages.map((item,ind)=> ind !== index ? item : newReaction)
            const res = await axios.post(REACTION_MESSAGE_ROUTE,{ 
                params: {
                    userId:userInfo.id,
                    typeReact:item.title,
                    messageId:chatId
              }
            })

            socket.current.emit("reaction-message",{
                messages:temp,
                to: changeCurrentUser.id
            })
            dispatch(setMessages(temp))
            setIsShowReactionMenu(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='bg-gray-700 w-fit px-3 py-2 rounded-3xl absolute z-20' style={{ top: contextMenuCordinates.y < 550 ? 40 : -50, left: contextMenuCordinates.x > 550 ? "" : 0 }}>
            <div className='flex gap-2'>
                {
                    reacttionMenuList.map((item, index) => {
                        return (
                            <div key={index} className='cursor-pointer transition hover:scale-125' onClick={() => handle(item)}>
                                <Image src={item.img} alt='icon' width={30} height={30} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ReactionMenu;