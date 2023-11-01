import {addMessageService,getMessagesService, getInitialContactswithMessagesService, addImageMessageService, addAudioMessageService} from '../services/MessageService.js'

export const addMessage = async (req, res) => {
    const {message, from, to} = req.body
    try {
        if(!message && !from && !to){
            return res.status(401).json({
                err: -1,
                msg: "From, to, message is require",
            })
        }
        const response = await addMessageService(message, from, to);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}

export const getMessage = async (req, res) => {
    const {from, to, take} = req.params
    try {
        const response = await getMessagesService(from, to, take);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}

export const getInitialContactswithMessages = async (req, res) => {
    try {
        const userId = parseInt(req.params.from)
        if(!userId){
            return res.status(401).json({
                err: -1,
                msg: "userId is require",
            })
        }
        const response = await getInitialContactswithMessagesService(userId);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}

export const addImageMessage = async (req, res) => {
    const {from, to} = req.query
    const file = req.file;
    try {
        if(!from && !to){
            return res.status(401).json({
                err: -1,
                msg: "From, to, message is require",
            })
        }
        const response = await addImageMessageService(file, from, to);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}


export const addAudioMessage = async (req, res) => {
    const {from, to} = req.query
    const file = req.file;
    try {
        if(!from && !to){
            return res.status(401).json({
                err: -1,
                msg: "From, to, message is require",
            })
        }
        const response = await addAudioMessageService(file, from, to);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Fail at auth controller!",
            error: error
        })
    }
}
