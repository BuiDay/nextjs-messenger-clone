import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import initRoutes from './routes/index.js'
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

initRoutes(app)

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server started on port: ${process.env.PORT}` )
})