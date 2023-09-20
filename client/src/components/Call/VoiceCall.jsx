import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";

const Container = dynamic(()=>import('./Container'),{ssr:false})

function VoiceCall() {
  const dispatch = useDispatch();

  const { voiceCall, userInfo, socket } = useSelector((state) => state.auth);

  useEffect(()=>{
    if(voiceCall.type === "out-going"){
      socket.current.emit("going-voice-call",{
        to:voiceCall.id,
        from:{
          id:userInfo.id,
          profilePicture:userInfo.profileImage,
          name:userInfo.name,
        },
        callType:voiceCall.type,
        roomId:voiceCall.roomId
      })
    }
  },[voiceCall])



  return <Container data={voiceCall} />
}

export default VoiceCall;