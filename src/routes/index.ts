import express, { Router, Request, Response } from 'express';
import authRoutes from '../app/controllers/authencation/auth.ts';
import info from '../app/controllers/user-info/info.ts';
import authMiddleware from '../app/middlewares/auth.ts';
import chat from '../app/controllers/chat/chat.ts'
const routes: Router = express.Router();

routes.get('/', (req: Request, res: Response) => {
    res.send('Hello World');

});

const auth = new authRoutes()

//! use middleware
routes.use('/auth',auth.getRouter())
routes.use('/info',authMiddleware,info)
routes.use('/chat/',authMiddleware,chat)


export default routes;
