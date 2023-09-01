import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import initRoutes from './routes/index.js'
import { Server } from 'socket.io'
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

initRoutes(app)

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
        onlineUsers.set(userId.toString(), socket.id)
        console.log(onlineUsers)
    })
    socket.on('send-msg',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to.toString());
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve',{
                from:data.from,
                message:data.message
            })
        }
        socket.on('disconnect',()=>{
            console.log(1)
        })
    })
   
})
