import { Model, Sequelize } from 'sequelize';

export default function(sequelize: Sequelize, DataTypes: any): any {
    class Messages extends Model {
        static associate(models: any) {
            Messages.belongsTo(models.Conversations, {
                foreignKey: 'conversation_id',
                as: 'conversation',
            });
            Messages.belongsTo(models.Participants, {
                foreignKey: 'user_id',
                as: 'conversation_member',
            });
        }
    }

    Messages.init(
        {
            message_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            conversation_id: {
                type: DataTypes.INTEGER,
            },
            content: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Messages',
        }
    );

    return Messages;
}
