import express from "express"
import {addMessage, getMessage,getInitialContactswithMessages} from '../controllers/MessageController.js'

const router = express.Router();

router.post("/add-messages",addMessage)
router.get("/get-messages/:from/:to",getMessage)
router.get("/get-initial-contacts/:from",getInitialContactswithMessages)

export default router
