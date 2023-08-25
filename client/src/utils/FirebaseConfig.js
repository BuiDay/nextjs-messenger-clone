import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAK8Tf8bjl9_Sq7SFyw97cK_kpMg-qRBck",
    authDomain: "what-app-880f7.firebaseapp.com",
    projectId: "what-app-880f7",
    storageBucket: "what-app-880f7.appspot.com",
    messagingSenderId: "813473482606",
    appId: "1:813473482606:web:b11a3f633170f6afcfa37f",
    measurementId: "G-Y01WW8H4K7"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);