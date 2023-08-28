import React, { useEffect } from "react";
import Image from "next/image";
import {FcGoogle} from 'react-icons/fc'
import { GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import {firebaseAuth} from '../utils/FirebaseConfig'
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useDispatch, useSelector} from "react-redux";
import {setUserInfo,setNewUser} from '../redux/auth/authSlice'
function login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {userInfo, newUser} = useSelector((state)=>state.auth);
  const handleLoginWithGoogle = async () =>{
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(firebaseAuth, provider)
    .then(async (result) => { 
      const {user:{displayName,email,photoURL}} = result
      if(email){
        const {data} = await axios.post(CHECK_USER_ROUTE,{email})
        if(!data.status){
          router.push('/onboarding')
          dispatch(setUserInfo({name:displayName,email,photoURL,status:""}))
          dispatch(setNewUser(true))
        }else{
          console.log(data)
          router.push('/')
          dispatch(setUserInfo({
            id:data.data.id,
            name:data.data.name,
            email:data.data.email,
            profileImage:data.data.profilePicture,
            status:data.data.about}))
          dispatch(setNewUser(false))
        }
      }
    })
  }

  useEffect(()=>{
    if(userInfo?.id && !newUser){
      router.push("/")
    }
  },[userInfo,newUser])

  return (
    <div className=" flex items-center justify-center bg-panel-header-background h-screen w-screen flex-col gap-6">
        <div className="flex items-center justify-center gap-2 text-white ">
          <Image src="/whatsapp.gif" width={200} height={200} alt="logo"/>
          <span className="text-7xl">Whatsapp</span>
        </div>
        <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={()=>handleLoginWithGoogle()}>
          <FcGoogle className="text-4xl"/>
          <span className="text-white text-2xl">Login with Google</span>
        </button>
    </div>
  )

}

export default login;
