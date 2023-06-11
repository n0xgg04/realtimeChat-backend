'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize, ModelStatic } from 'sequelize';

interface SequelizeConfig {
  use_env_variable: any;
  development: {
    username: string;
    password: string | null;
    database: string;
    host: string;
    dialect: 'mysql';
  };
  test: {
    username: string;
    password: string | null;
    database: string;
    host: string;
    dialect: 'mysql';
  };
  production: {
    username: string;
    password: string | null;
    database: string;
    host: string;
    dialect: 'mysql';
  };
}

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config: SequelizeConfig = require(path.join(__dirname, '/../config/config.json'))[env];
const db: any = {};

let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] || '', config as any)
} else {
  const { database, username, password } = config.development;

  if (!database || !username) {
    throw new Error('Invalid database configuration. Please provide database and username values.');
  }

  sequelize = new Sequelize(database, username, password as any, config as any);
}

fs.readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file)).default;
      db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db as {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
} & { [modelName: string]: ModelStatic<any> };
