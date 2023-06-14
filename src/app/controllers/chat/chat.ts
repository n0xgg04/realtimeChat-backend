import { Router, Request, Response } from 'express';
import { getUserInfo } from '../user.ts';
import ParticipantModel from '../../../database/models/participant.ts'
import ConversationModel from '../../../database/models/conversation.ts'
import MessagesModel from '../../../database/models/message.ts'
import UserModel from '../../../database/models/user.ts'
import sequelize from '../../../database/connection/index'
import {DataTypes} from 'sequelize'

const chat: Router = Router();

chat.get('/', async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userInfo = getUserInfo(token as string);
    const Participants = ParticipantModel(sequelize, DataTypes)
    const Conversations = ConversationModel(sequelize, DataTypes)
    const Messages = MessagesModel(sequelize, DataTypes)

    const user_id = userInfo.user_id;

    //relationships
    Participants.hasMany(Messages, { as: 'conversation_messages', foreignKey: 'conversation_id' });
    Conversations.hasMany(Messages, { as: 'conversation_messages', foreignKey: 'conversation_id' });
    Messages.belongsTo(Participants, { as: 'conversation_member', foreignKey: 'user_id' });
    Messages.belongsTo(Conversations, { as: 'conversation', foreignKey: 'conversation_id' });
    Participants.belongsTo(Conversations, { as: 'conversation', foreignKey: 'conversation_id' });
    Conversations.hasMany(Participants, { as: 'participants', foreignKey: 'conversation_id' });



    const participants = await Participants.findAll({
        where: {
            user_id: user_id,
        },
        include: [
            {
                model: Conversations,
                as: 'conversation',
            },
        ],
    });
    const formattedData = await Promise.all(participants.map(async (participant: any) => {
        const isPrivate = participant.conversation && participant.conversation.conversation_name && participant.conversation.conversation_name.includes('privateChat');
        const conversationType: "private" | "group" = isPrivate ? 'private' : 'group';

        const messages = await Messages.findAll({
            where: {
                conversation_id: participant.conversation_id,
            },
            attributes: ['message_id', ['content', 'message_content'], 'user_id', 'createdAt', 'updatedAt'],
        });

        return {
            conversation_id: participant.conversation_id,
            conversation_member: participant.conversation_member,
            conversation_messages: messages,
            conversation_type: conversationType,
            conversation_name: participant.conversation && participant.conversation.conversation_name,
        };
    }));

    res.status(200).json({
        status: 'success',
        data: await formattedData
    })
});

chat.post('/send/:conversation_id', async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userInfo = getUserInfo(token as string);
    const { conversation_id } = req.params;
    const { message } = req.body;

    if (!message) {
        res.status(400).json({
            status: 'error',
            message: 'Bad Request'
        })
        return;
    }

    try {
        const Participants = ParticipantModel(sequelize, DataTypes)
        const Conversations = ConversationModel(sequelize, DataTypes)
        const Messages = MessagesModel(sequelize, DataTypes)
        const user_id = userInfo.user_id;
        const conversation = await Conversations.findOne({
            where: {
                conversation_id: conversation_id
            }
        })

        if (!conversation) {
            res.status(400).json({
                status: 'error',
                message: 'Conversation not found'
            })
            return;
        }

        const participant = await Participants.findOne({
            where: {
                conversation_id: conversation_id,
                user_id: user_id
            }
        })

        if (!participant) {
            res.status(400).json({
                status: 'error',
                message: 'Participant not found'
            })
            return;
        }

        const newMessage = await Messages.create({
            message_id: null,
            conversation_id : conversation_id,
            user_id: user_id,
            content: message,
        })


        res.status(200).json({
            status: 'success',
            message: message
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        })
    }
})
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
           //only 10 number from mid
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
