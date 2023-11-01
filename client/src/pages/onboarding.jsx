import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import {useSelector } from "react-redux";
import Input from '../components/common/Input'
import Avatar from '../components/common/Avatar'
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { useDispatch} from "react-redux";
import {setUserInfo,setNewUser} from '../redux/auth/authSlice'
import { useRouter } from "next/router";

function onboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {userInfo, newUser} = useSelector((state)=>state.auth);
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState('/default_avatar.png');
  

  // useEffect(()=>{
  //   if(!newUser&& !userInfo?.email) router.push("/login");
  //   else if(!newUser && userInfo.email) router.push("/");
  // },[newUser,userInfo,router])

  const onboardUserHandle = async () =>{
    if(validateDetails()){
      const email = userInfo.email;
      try {
        const {data} = await axios.post(ONBOARD_USER_ROUTE,{
          email,name,about,image
        });
        if(data.status){
          dispatch(setUserInfo({id:data.data.id,name,email,profileImage:image,status:about}))
          dispatch(setNewUser(false))
          router.push('/')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }  

  const validateDetails = () =>{
    if(name.length < 3){
      return false;
    }
    return true;
  }

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
          <div className="md:block hidden">
            <Image src="/favicon1.png" width={200} height={200} alt="logo"/>
          </div>
          <div className="md:hidden block">
            <Image src="/favicon1.png" width={100} height={100} alt="logo"/>
          </div>
        <span className="md:text-7xl text-4xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6 md:flex-row flex-col-reverse">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
            <Input name="Display name" state={name} setState={setName} label/>
            <Input name="About" state={about} setState={setAbout} label/>
            <div className="flex items-center justify-center" onClick={onboardUserHandle}>
              <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-3 rounded-lg hover:bg-dropdown-background-hover transition-all">Create Profile</button>
            </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage}/>
        </div>
      </div>
    </div>
  )
  
}

export default onboarding;
