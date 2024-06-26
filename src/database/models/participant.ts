import { Model, Sequelize } from 'sequelize';

export default function(sequelize: Sequelize, DataTypes: any): any {
    class Participant extends Model {
        static associate(models: any) {
            Participant.belongsTo(models.Conversations, {
                foreignKey: 'conversation_id',
                as: 'conversation',
            });
            Participant.hasMany(models.Messages, {
                foreignKey: 'conversation_id',
                as: 'conversation_messages',
            });
        }
    }

    Participant.init(
        {
            participant_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            conversation_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
            },
        },
        {
            sequelize,
            modelName: 'Participants',
        }
    );

    return Participant;
}
