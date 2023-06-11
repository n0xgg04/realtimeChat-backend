"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = __importDefault(require("../database/connection"));
const user_1 = __importDefault(require("../database/models/user"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const UserModel = (0, user_1.default)(connection_1.default, sequelize_1.DataTypes);
const JWT = config_1.default.jwt;
class Authencation {
    constructor() {
        this.router = (0, express_1.Router)();
        this.router.post('/login', this.handLogin);
        this.router.get('/', (req, res) => {
            res.send('Hello cái dmm');
        });
    }
    getRouter() {
        return this.router;
    }
    handLogin(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (!username || !password) {
            res.status(200).json({
                status: 'error',
                message: 'username or password is not empty',
                receive: {
                    username: username,
                    password: password
                }
            });
            return;
        }
        UserModel.findOne({
            where: {
                username: username,
                password: password
            },
            attributes: ['user_id', 'username', 'email', 'avatar']
        }).then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user) {
                const token = jsonwebtoken_1.default.sign({
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }, JWT);
                res.status(200).json({
                    status: 'success',
                    token: token
                });
            }
            else {
                res.status(200).json({
                    status: 'error',
                    error: 1,
                    message: 'username or password is not correct'
                });
            }
        })).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err.message
            });
        });
    }
}
exports.default = Authencation;
