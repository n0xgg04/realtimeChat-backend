import { Router, Request, Response } from 'express';
import { getUserInfo } from '../user.ts';
import ParticipantModel from '../../../database/models/participant.ts'
import ConversationModel from '../../../database/models/conversation.ts'
import UserModel from '../../../database/models/user.ts'
import sequelize from '../../../database/connection/index'
import {DataTypes} from 'sequelize'

const chat: Router = Router();

chat.get('/', async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userInfo = getUserInfo(token as string);
    const Participants = ParticipantModel(sequelize, DataTypes)
    const user_id = userInfo.user_id;

    const conversations = await Participants.findAll({
        where: {
            user_id: user_id
        },
        attributes: ['conversation_id']
    })


    res.status(200).json({
        status: 'success',
        data: conversations
    })
});

chat.post('/', async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userInfo = getUserInfo(token as string);

    const {partnerId} = req.body;
    if (!partnerId) {
        res.status(400).json({
            status: 'error',
            message: 'Bad Request'
        })
        return;
    }

    try {
        const Participants = ParticipantModel(sequelize, DataTypes)
        const Conversations = ConversationModel(sequelize, DataTypes)
        const User = UserModel(sequelize, DataTypes)
        const user_id = userInfo.user_id;
        const partner = await User.findOne({
            where: {
                user_id: partnerId
            }
        })

        if (!partner) {
            res.status(400).json({
                status: 'error',
                message: 'Partner not found'
            })
            console.log("partner not found")
            return;
        }
        //random conversationId (int ) with timestamp and user_id
             let conversation_id : number = parseInt(Date.now() + user_id + partnerId + Math.floor(Math.random() * 1000));
           //only 10 number
            if(conversation_id.toString().length > 10){
                conversation_id = parseInt(conversation_id.toString().slice(0,10))
            }

            await Conversations.create({
                conversation_id: conversation_id,
                conversation_name: "privateChat|" + user_id + "|" + partnerId,
                createdAt: new Date(),
            })
            await Participants.create({
                    user_id: user_id,
                    conversation_id: conversation_id
                })
            await Participants.create({
                     user_id: partnerId,
                    conversation_id: conversation_id
            })

        res.status(200).json({
            status: 'success',
            data: {
                conversation_id: conversation_id
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: err
        })
        return;
    }
})

export default chat;
