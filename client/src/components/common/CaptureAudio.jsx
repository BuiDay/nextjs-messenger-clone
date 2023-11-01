import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash,FaCircle } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import { setAddMessages } from "../../redux/auth/authSlice";
import { ADD_AUDIO_MESSAGE_ROUTE} from "@/utils/ApiRoutes";
import axios from "axios";

function CaptureAudio({ setIsShowAudioRecorder }) {
  const dispatch = useDispatch();
  const { userInfo, socket, changeCurrentUser } = useSelector((state) => state.auth);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState();
  const [wareform, setWareform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null)

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);  
  const wareformRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: wareformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true
    });
    setWareform(wavesurfer);
    wavesurfer.on('finish', () => {
      setIsPlaying(false)
    })
    return () => { wavesurfer.destroy() };
  }, [])


  useEffect(() => {
    if (wareform) {
      handleStartRecording();
    }
  }, [wareform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRenderedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;
        const chunks = []; 
        
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);
          wareform.load(audioURL);
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
        mediaRecorder.start();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {recordedAudio.removeEventListener("timeupdate", updatePlaybackTime)};
    }
  }, [recordedAudio])

  const handlePlayRecording = () => {
    if (recordedAudio) {
      wareform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      wareform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], 'recording.mp3');
        setRenderedAudio(audioFile)
      })
    }
  }

  const handlePauseRecording = () => {
    wareform.pause();
    recordedAudio.pause();
    setIsPlaying(false);
  }

  const sendRecording = async () => {
      try {
        const formData = new FormData();
        formData.append("audio", renderedAudio);
        const { data } = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          params: {
            from: userInfo.id,
            to: changeCurrentUser.id
          }
        })
        if (data.status) {
          socket.current.emit("send-msg", {
            to: changeCurrentUser.id,
            from: userInfo.id,
            message: data.message,
          });
          setRenderedAudio(null);
          setIsShowAudioRecorder(false);
          dispatch(
            setAddMessages({
              ...data.message,
            })
          );
        }
      } catch (error) {
        console.log(error)
      }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        {
          !isRecording && <FaTrash className="text-panel-header-icon cursor-pointer" onClick={() => setIsShowAudioRecorder(false)} />
        }
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {
          isRecording ? (
            <div className="text-red-500 animate-pulse 2-60 text-center flex justify-center items-center gap-1">
              <FaCircle className="text-sm" /> Recording 
              <span>{recordingDuration}s</span>
            </div>
          ) : (
            <div>
              {
                recordedAudio &&
                <>
                  {!isPlaying ?
                    <FaPlay className="cursor-pointer" onClick={handlePlayRecording} /> :
                    <FaPauseCircle className="cursor-pointer" onClick={()=>handlePauseRecording()} />
                  }
                </>
              }
            </div>
          )
        }
        <div className="w-60" ref={wareformRef} hidden={isRecording} />
        {
          !isRecording && recordedAudio && isPlaying && (<span>{formatTime(currentPlaybackTime)}</span>)
        }
        {
          !isRecording && recordedAudio && !isPlaying && (<span>{formatTime(totalDuration)}</span>)
        }
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {
          !isRecording ?
            <FaMicrophone className="text-red-500" onClick={() => handleStartRecording()} /> :
            <FaStop className="text-red-500 cursor-pointer" onClick={() => handleStopRecording()} />
        }
      </div>
      <div>
        { !isRecording && <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={() => sendRecording()} />}
       
      </div>
    </div>
  );
}

export default CaptureAudio;
