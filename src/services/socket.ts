import {getUserInfo} from '../app/controllers/user.ts'
import ParticipantModel from '../database/models/participant.ts'
import UserModel from '../database/models/user.ts'
import sequelize from "../database/connection";
import {DataTypes, Op} from "sequelize";

const User = UserModel(sequelize, DataTypes)
export function socketApp(io: any) {
    io.on('connection', (socket: any) => {
        console.log('a user connected', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('online', async (data: any) => {
            const {token} = data;
            const userInfo = getUserInfo(token as string);
            const {user_id} = userInfo;
            console.log("online", user_id)
            //update socketId

            await User.update({
                socketId: socket.id,
            }, {
                where: {
                    user_id: user_id
                }
            })
        })

        socket.on('send-message',async (data: any) => {
            let token = data.token;

            const userInfo = getUserInfo(token as string);
            const {conversation_id, message_content} = data;
            if (!message_content) {
                return;
            }

            const Participants = ParticipantModel(sequelize, DataTypes)

            try {
                //except sender
                const joiner = await Participants.findAll({
                    where: {
                        conversation_id: conversation_id,
                        user_id: {
                            [Op.ne]: userInfo.user_id
                        }
                    }
                })

                //get list of socketId by User table and joiner
                const socketList = await User.findAll({
                    where: {
                        user_id: {
                            [Op.in]: joiner.map((joiner: any) => joiner.user_id)
                        }
                    },
                    attributes: ['socketId']
                })


                //send message to all socketId
                socketList.forEach((socket: any) => {
                    console.log("send message to", socket.socketId)
                    io.to(socket.socketId).emit('receive-message', {
                        conversation_id: conversation_id,
                        message_content: message_content,
                        sender_id: userInfo.user_id,
                        message_time : new Date().toLocaleTimeString(),
                    });
                })
            } catch (err) {
                console.log(err)
            }
        })

    });
}