import { Router, Request, Response } from 'express';
import sequelize from "../../../database/connection";
import User from "../../../database/models/user.ts"
import {DataTypes} from "sequelize";
import jwt from 'jsonwebtoken'
import config from '../../../config'

const UserModel = User(sequelize,DataTypes)
const JWT : string | undefined = config.jwt


class Authencation{
    private router: Router;

    constructor(){
        this.router = Router()
        this.router.post('/login',this.handLogin)
        this.router.get('/',(req: Request, res: Response) => {
            res.send('Hello cái dmm');
        })
    }

    public getRouter(): Router{
        return this.router
    }

    public handLogin(req: Request, res: Response): void{
        let username : string = req.body.username
        let password : string = req.body.password

        if(!username || !password){
            res.status(200).json({
                status: 'error',
                message: 'username or password is not empty',
                receive: {
                    username: username,
                    password: password
                }
            })
            return;
        }


        UserModel.findOne({
            where: {
                username: username,
                password: password
            },
            attributes: ['user_id','username','email','avatar']
        }).then(async(user: any) => {
            if(user) {
                const token = jwt.sign({
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }, JWT as string)

                res.status(200).json({
                    status: 'success',
                    token: token
                })
            }else{
                res.status(200).json({
                    status: 'error',
                    error : 1,
                    message: 'username or password is not correct'
                })
            }
        }).catch((err: any) => {
            res.status(400).json({
                status: 'error',
                message: err.message
            })
        })
    }
}


export default Authencation