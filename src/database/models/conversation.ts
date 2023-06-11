import { Model, Sequelize } from 'sequelize';

export default function(sequelize: Sequelize, DataTypes: any): any {
  class Conversation extends Model {
    static associate(models : any) {
      // define association here
    }
  }
  Conversation.init({
    conversation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    conversation_name : {
      type : DataTypes.STRING,
      unique : true
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
    }
  }, {
    sequelize,
    modelName: 'Conversations',
  });
  return Conversation;
}