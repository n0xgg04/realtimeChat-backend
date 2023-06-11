"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.PORT || 1234,
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        username: 'root',
        password: '',
        database: 'messenger'
    },
    jwt: "DIT_ME_MAY"
};
exports.default = config;
