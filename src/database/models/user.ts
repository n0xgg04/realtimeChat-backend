'use strict';
import { Model, Sequelize } from 'sequelize';

export default function(sequelize: Sequelize, DataTypes: any): any {
  class User extends Model {
    static associate(models: any) {
      // define association here
    }
  }

  User.init(
      {
        user_id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        avatar: DataTypes.STRING,
        socketId : DataTypes.STRING,
        createdAt: {
                type: DataTypes.DATE,
                field: 'createdAt',
                allowNull: false,
        },
        updatedAt: {
                type: DataTypes.DATE,
                field: 'updatedAt',
                allowNull: false,
        }
      },
      {
        sequelize,
        modelName: 'User',
      }
  );

  return User;
};
