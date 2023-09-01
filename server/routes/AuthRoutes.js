import express from "express"
import {checkUser, onboardUser, getAllUser} from '../controllers/AuthController.js'

const router = express.Router();
router.post("/check-user",checkUser)
router.post("/onboard-user",onboardUser)
router.get("/get-contacts",getAllUser)

export default router