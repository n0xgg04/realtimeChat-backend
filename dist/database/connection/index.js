"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../config"));
const env = process.env.NODE_ENV || 'development';
const sequelize = new sequelize_1.Sequelize(config_1.default.mysql.database, config_1.default.mysql.username, config_1.default.mysql.password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});
exports.default = sequelize;
