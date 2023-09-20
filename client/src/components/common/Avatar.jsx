import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "../common/PhotoPicker";
import PhotoLibrary from "../common/PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);

  const [grabPhoto, setGrabPhoto] = useState(false);
  const [photoLibrary, setPhotoLibrary] = useState(false);
  const [capturePhoto, setCapturePhoto] = useState(false);

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({ x: 0, y: 0 });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true)
  }

  const contextMenuOptions = [
    {
      name: "Take photo",
      callback: () => {
        setCapturePhoto(true)
      }
    },
    {
      name: "Choose From Library",
      callback: () => {
        setPhotoLibrary(true);
      }
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      }
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage('/default_avatar.png')
      }
    }
  ];

  const handlePhotoPicker = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement('img');
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src)
    }, 100)
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000)
      }
    }
  }, [grabPhoto])


  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avartar" className="rounded-full" fill />
          </div>
        )}

        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avartar" className="rounded-full" fill />
          </div>
        )}

        {type === "xl" && (
          <div className="relative cursor-pointer z-10"
            onClick={(e) => showContextMenu(e)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 transition-all
           duration-300 ease-in-out z-10 ${!isContextMenuVisible && hover ? "opacity-100" : "opacity-0"}`} id="context-opener">
              <FaCamera className="text-2xl" id="context-opener" />
              <span onClick={(e) => showContextMenu(e)}>Change <br /> Profile <br /> Photo</span>
            </div>
            <div className="flex items-center justify-center h-60 w-60">
              <Image src={image} alt="avartar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {
        isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )
      }
      {
        grabPhoto && <PhotoPicker onChange={handlePhotoPicker} />
      }
       {
        capturePhoto && <CapturePhoto setImage={setImage} hideCapturePhoto={setCapturePhoto} />
      }
      {
        photoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setPhotoLibrary} />
      }
    </>
  );
}

export default Avatar;
