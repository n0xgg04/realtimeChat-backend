import { Sequelize } from 'sequelize';
import config from '../../config';

const env = process.env.NODE_ENV || 'development';

const sequelize: Sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

export default sequelize;
