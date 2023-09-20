import { setEndCall } from "@/redux/auth/authSlice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ThreeDots from "../common/ThreeDots";
import axios from "axios";
import { GENERATE_TOKEN_ROUTE } from "@/utils/ApiRoutes";

function Container({ data }) {
  const { userInfo, socket } = useSelector((state) => state.auth);
  const [callAccepted, setCallAccpeted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream_1, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data.type === 'out-going') {
      socket.current.on("accept-call", () => {
        setCallAccpeted(true)
      })
    } else {
      setTimeout(() => {
        setCallAccpeted(true);
      }, 1000)
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get(`${GENERATE_TOKEN_ROUTE}/${userInfo.id}`)
        if (data.status) {
          setToken(data.token)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
    if (token) {
      startCall();
    }
  }, [callAccepted])

  // useEffect(() => {
    const startCall = async () => {
      import('zego-express-engine-webrtc').then(async ({ ZegoExpressEngine }) => {
        const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APPID, process.env.NEXT_PUBLIC_ZEGO_SERVERSECRET);
        setZgVar(zg);
        zg.on('roomStreamUpdate', async (roomId, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement(data.callType === 'video' ? 'video' : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            if (rmVideo) {
              rmVideo.appendChild(vd);
            }
            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true,
            }).then((stream) => (vd.srcObject = stream))

          } else if (updateType === 'DELETE' && zg && localStream_1 && streamList[0].streamID) {
            zg.destroyStream(localStream_1);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch(setEndCall())
          }
        })

        await zg.loginRoom(
          data.roomId.toString(),
          token,
          { userID: userInfo.id.toString(), userName: userInfo.name },
          { userUpdate: true }
        ).then(async(result) => {
          if (result == true) {
            console.log("login success")

            const localStream = await zg.createStream({
              camera: {
                audio: true,
                video: data.callType === 'video' ? true : false,
              }
            });

            const localVideo = document.getElementById('local-audio');
            const videoElement = document.createElement(
              data.callType === "video" ? "video" : "audio"
            );
            videoElement.id = "video-local-zego";
            // videoElement.className = 'h-28 w-32';
            videoElement.autoplay = true;
            videoElement.muted = false;
            videoElement.playsInline = true;

            localVideo.appendChild(videoElement);

            const td = document.getElementById("video-local-zego")
            td.srcObject = localStream;
            const streamID = "123" + Date.now();
            setPublishStream(streamID);
            setLocalStream(localStream);
            zg.startPublishingStream(streamID, localStream)
          }
        }).catch(error=>console.log(error))
      })
    }
    
  // }, [token])

  const handleClick = () => {
    const id = data.id;
    if (zgVar && localStream_1 && publishStream) {
      zgVar.destroyStream(localStream_1);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString())
    }
    if (data.callType === 'voice') {
      socket.current.emit("reject-voice-call", {
        from: id
      })
    } else {
      socket.current.emit("reject-video-call", {
        from: id
      })
    }
    dispatch(setEndCall());
  }

  return <div className="text-white border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center">
    <div className="flex flex-col gap-3 items-center">
      <span className="text-5xl">{data.name}</span>
      <div className="text-2xl mt-5 flex items-center gap-2">
        {
          callAccepted && data.callType !== "video" ? "On going call" : "Calling"
        }
        <div className="">
         {
          !callAccepted && <ThreeDots />
         } 
        </div>
      </div>
    </div>
    {(!callAccepted || !data.callType === "video") && <div className="my-24 rounded-full overflow-hidden h-[300px] w-[300px]">
      <Image src={data.profilePicture} alt="avatar" height={500} width={500} className="h-full" />
    </div>
    }
    <div className="my-5" id="remote-video">
      <div className="" id="local-audio">

      </div>
    </div>
    <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
      <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={() => handleClick()} />
    </div>
  </div>;
}

export default Container;
