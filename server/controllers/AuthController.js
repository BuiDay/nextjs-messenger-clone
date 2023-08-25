
import { checkUserService,onboardUserService } from '../services/AuthService.js'

export const checkUser = async (req, res) => {
    const {email} = req.body;
    try {
        if (!email) {
            return res.json({
                msg: "Email is required",
                status: false
            })
        } else {
            const response = await checkUserService(email);
            return res.status(200).json(response)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}


export const onboardUser = async (req, res) => {
    const {email,name,about,image:profilePicture} = req.body;
    try {
        if (!email|!name|!about|!profilePicture) {
            return res.json({
                msg: "Email, Name, About, Image is required",
                status: false
            })
        } else {
            const response = await onboardUserService(email,name,about,profilePicture);
            return res.status(200).json(response)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}
