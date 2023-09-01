import authRouter from './AuthRoutes.js';
import messagesRouter from './MessageRoutes.js';

const initRoutes = (app) => {
    app.use("/api/v1/auth",authRouter)
    app.use("/api/v1/messages",messagesRouter)

    return app.use('/',(req, res)=>{
        res.send('server on...')
    })
}

export default initRoutes

