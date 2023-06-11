"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_ts_1 = __importDefault(require("../app/controllers/authencation/auth.ts"));
const info_ts_1 = __importDefault(require("../app/controllers/user-info/info.ts"));
const auth_ts_2 = __importDefault(require("../app/middlewares/auth.ts"));
const chat_ts_1 = __importDefault(require("../app/controllers/chat/chat.ts"));
const routes = express_1.default.Router();
routes.get('/', (req, res) => {
    res.send('Hello World');
});
const auth = new auth_ts_1.default();
//! use middleware
routes.use('/auth', auth.getRouter());
routes.use('/info', auth_ts_2.default, info_ts_1.default);
routes.use('/chat/', auth_ts_2.default, chat_ts_1.default);
exports.default = routes;
