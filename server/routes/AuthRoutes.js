import express from "express"
import {checkUser, onboardUser, getAllUser,generateToken,reationMessages} from '../controllers/AuthController.js'

const router = express.Router();
router.post("/check-user",checkUser)
router.post("/onboard-user",onboardUser)
router.get("/get-contacts",getAllUser)
router.get("/generate-token/:id", generateToken)
router.post("/reaction-message", reationMessages)
export default router