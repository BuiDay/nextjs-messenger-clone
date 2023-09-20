import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {

  const { userInfo, changeCurrentUser, getMessages } = useSelector((state) => state.auth);

  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const wareformRef = useRef(null);
  const wareform = useRef(null);

  useEffect(() => {
    wareform.current = WaveSurfer.create({
      container: wareformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 3,
      height: 40,
      responsive: true,
    });
    wareform.current.on('finish', () => {
      setIsPlaying(false)
    })

    return () => { wareform.current.destroy() };
  }, [])

  useEffect(() => {
    try {
      const audioUrl = `${HOST}/${message.message}`
      const audio = new Audio(audioUrl);
      setAudioMessage(audio);
      wareform.current.load(audioUrl);
      wareform.current.on("ready", () => {
        setTotalDuration(wareform.current.getDuration())
      })
    }
    catch (e) {
      console.log(e)
    }
  }, [message.message])
  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => { audioMessage.removeEventListener("timeupdate", updatePlaybackTime) };
    }
  }, [audioMessage])

  const handlePlayAudio = () => {
    if (audioMessage) {
      wareform.current.stop();
      wareform.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  }

  const handlePauseAudio = () => {
    wareform.current.pause();
    audioMessage.pause();
    setIsPlaying(false);
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }


  return (
    <div className={`flex items-center gap-5 text-white pt-2 px-2 text-sm rounded-lg ${message.senderId === changeCurrentUser.id ? 'bg-incoming-background' : 'bg-outgoing-background'}`}>
      <div className="cursor-pointer text-xl">
        {
          !isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />
        }
      </div>
      <div className="relative ">
        <div className="w-60" ref={wareformRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between ">
          <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {
              message.senderId !== changeCurrentUser.id && <MessageStatus messageStatus = {message.messageStatus}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
