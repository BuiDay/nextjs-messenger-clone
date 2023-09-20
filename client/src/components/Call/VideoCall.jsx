import React,{useEffect} from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";

const Container = dynamic(()=>import('./Container'),{ssr:false})

function VideoCall() {
  const { videoCall, userInfo, socket } = useSelector((state) => state.auth);

  useEffect(()=>{
    if(videoCall.type === "out-going"){
      socket.current.emit("going-video-call",{
        to:videoCall.id,
        from:{
          id:userInfo.id,
          profilePicture:userInfo.profileImage,
          name:userInfo.name,
        },
        callType:videoCall.callType,
        roomId:videoCall.roomId
      })
    }
  },[videoCall])

  return <Container data={videoCall} />
}

export default VideoCall;
