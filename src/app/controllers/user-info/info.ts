import {Router} from 'express'
import config from '../../../config'
import jwt from "jsonwebtoken";
import User from "../../../database/models/user.ts";
import sequelize from "../../../database/connection";
import {DataTypes} from "sequelize";

const info: Router = Router()
const UserModel = User(sequelize,DataTypes)
info.get('/me', async(req, res) => {
    //get header
    const token : any = req.headers['authorization']
    if(!token) {
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        })
        return;
    }

    //get token
    const tokenString = token.split(' ')[1]
    try{
        const decode : any = jwt.verify(tokenString, config.jwt as string)
        const user_id = decode['user_id']
        const userData = await UserModel.findOne({
            where: {
                user_id: user_id
            },
            attributes: ['user_id','username','email','avatar']
        })

        if(userData){
            res.status(200).json({
                status: 'success',
                data: userData
            })
            return;
        }

        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        })
    }catch(err){
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        })
        return;
    }
})

export default info