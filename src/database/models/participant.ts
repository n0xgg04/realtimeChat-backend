import { Model, Sequelize } from 'sequelize';

export default function(sequelize: Sequelize, DataTypes: any): any {
    class Participant extends Model {
        static associate(models: any) {
            // define association here
        }
    }

    Participant.init(
        {
            participant_id : {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            conversation_id : {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            user_id : {
                type: DataTypes.INTEGER,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
            }
        },
        {
            sequelize,
            modelName: 'Participants',
        })

    return Participant;
}