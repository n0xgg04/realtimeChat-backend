'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function default_1(sequelize, DataTypes) {
    class User extends sequelize_1.Model {
        static associate(models) {
            // define association here
        }
    }
    User.init({
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        avatar: DataTypes.STRING,
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
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
}
exports.default = default_1;
;
