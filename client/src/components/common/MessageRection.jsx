import Image from 'next/image';
import React, { useState } from 'react';
import { useEffect } from 'react';

const MessageRection = ({ type }) => {

    const [typeImg, setTypeImg] = useState()

    useEffect(()=>{
        switch (type) {
            case "heart":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png')
                break;
            case "laughing":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f606.png')
                break;
            case "cry":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png')
                break;
            case "open mouth":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62e.png')
                break;
            case "persevere":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f623.png')
                break;
            case "pray":
                setTypeImg('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png')
                break;
            default:
                break;
        }
    },[type])
    return (
        <div className='absolute bottom-[-13px] right-0 z-30'>
            <div className='bg-conversation-panel-background p-[3px] rounded-full shadow shadow-gray-700'>
                <Image src={typeImg} alt='reaction' height={16} width={16} />
            </div>
        </div>
    );
};

export default MessageRection;