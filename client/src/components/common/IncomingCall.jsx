import { setEndCall, setIncomingVoiceCall, setVoiceCall } from "@/redux/auth/authSlice";
import Image from "next/image";
import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

function IncomingCall() {
  const { incomingVoiceCall, socket, userInfo, videoCall } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const acceptCall = () => {
    dispatch(setVoiceCall({
      ...incomingVoiceCall,
      type: 'in-coming'
    }))

    socket.current.emit("accept-incoming-call", {
      id: incomingVoiceCall.id
    })
    dispatch(setIncomingVoiceCall(undefined))
  }

  const rejectCall = () => {
    socket.current.emit("reject-voice-call", {
      from: incomingVoiceCall.id
    });
    dispatch(setEndCall())
  }
  return (
    <div className="h-25 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-lg flex gap-5 items-center justify-center bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-3">
      <div className="">
        <Image src={incomingVoiceCall.profilePicture} height={80} width={80} alt="avatar" />
      </div>
      <div>
        <div>{incomingVoiceCall.name}</div>
        <div className="text-xs">Incoming Call</div>
        <div className="flex gap-2 mt-2">
          <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={() => rejectCall()}>
            Reject
          </button>
          <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>
            Accept
          </button>
        </div>
      </div>

    </div>
  )
}

export default IncomingCall;
