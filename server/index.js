import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import initRoutes from './routes/index.js'
import { Server } from 'socket.io'
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

initRoutes(app);

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server started on port: ${process.env.PORT}` )
})

const io = new Server (server,{
    cors:{
        origin:"http://localhost:3000"
    }
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        try {
            onlineUsers.set(userId?.toString(), socket.id);
            socket.emit('online-users',{
                onlineUsers:Array.from(onlineUsers.keys())
            })
        } catch (error) {
            console.log(error)
        }
       
    })

    socket.on('disconnect',()=>{
       
    })
    
    socket.on('send-msg',(data)=>{
        try {
            const sendUserSocket = onlineUsers.get(data?.to?.toString());
            if(sendUserSocket){
                socket.to(sendUserSocket).emit('msg-recieve',{
                    from:data.from,
                    message:data.message
                })
            }
        } catch (error) {
            console.log(error)
        }
       
    })

    socket.on("going-voice-call",(data)=>{
        const sendUserSocket = onlineUsers.get(data?.to?.toString());
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('incoming-voice-call',{
                from:data.from,
                roomId:data.roomId,
                callType:data.callType
            })
        }
    })

    socket.on("going-video-call",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to.toString());
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('incoming-video-call',{
                from:data.from,
                roomId:data.roomId,
                callType:data.callType
            })
        }
    })

    socket.on("reject-voice-call",(data)=>{
        const sendUserSocket = onlineUsers.get(data.from.toString());
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('voice-call-rejected')
        }
    })

    socket.on("reject-video-call",(data)=>{
        const sendUserSocket = onlineUsers.get(data.from.toString());
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('video-call-rejected')
        }
    })

    socket.on("accept-incoming-call",({id})=>{
        const sendUserSocket = onlineUsers.get(id.toString());
        socket.to(sendUserSocket).emit('accept-call')
    })

    socket.on("signout",(userId)=>{
        onlineUsers.delete(userId,toString());
        socket.broadcast.emit('online-users',{
            onlineUsers:Array.from(onlineUsers.keys())
        })
    })
    
    socket.on('reaction-message',(data)=>{
        try {
            const sendUserSocket = onlineUsers.get(data.to.toString());
            if(sendUserSocket){
                socket.to(sendUserSocket).emit('reaction-message-recieve',{
                    message:data.messages
                })
            }
        } catch (error) {
            console.log(error)
        }
       
    })

})
