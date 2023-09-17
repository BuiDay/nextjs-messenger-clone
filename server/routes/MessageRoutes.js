import express from "express"
import {addMessage, getMessage,getInitialContactswithMessages,addImageMessage} from '../controllers/MessageController.js'
import multer from 'multer'

const router = express.Router();

const uploadImage = multer({dest:"uploads/images/"})

router.post("/add-messages",addMessage)
router.get("/get-messages/:from/:to",getMessage)
router.get("/get-initial-contacts/:from",getInitialContactswithMessages)

router.post("/add-image-message",uploadImage.single("image"),addImageMessage)

export default router
