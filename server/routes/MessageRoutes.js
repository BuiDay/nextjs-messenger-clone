import express from "express"
import {addMessage, getMessage,getInitialContactswithMessages,addImageMessage,addAudioMessage} from '../controllers/MessageController.js'
import multer from 'multer'

const router = express.Router();

const uploadImage = multer({dest:"uploads/images/"})
const uploadAudio = multer({dest:"uploads/recordings/"})

router.post("/add-messages",addMessage)
router.get("/get-messages/:from/:to",getMessage)
router.get("/get-initial-contacts/:from",getInitialContactswithMessages)

router.post("/add-image-message",uploadImage.single("image"),addImageMessage)
router.post("/add-audio-message",uploadAudio.single("audio"),addAudioMessage)

export default router
