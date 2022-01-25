import fs from 'fs';
import { resolve, } from 'path';
import process from 'process';
import Sequelize from 'sequelize';
import configs from './config';

const { env, } = process;
const mode = env.NODE_ENV ?? 'development';
const { database, username, password, ...config } = configs[mode];
const sequelize = new Sequelize(database, username, password, config);

const modelsRootPath = resolve(__dirname, 'model');
const models = fs.readdirSync(modelsRootPath)
  .filter(file => /^[^.~!].*?[.][jt]s$/.test(file))
  .map(file => {
		const filePath = resolve(modelsRootPath, file);
		const Model = require(filePath);
    const model = Model(sequelize, Sequelize.DataTypes);
		return [model.name, model];
  })
	.reduce((_, [name, model]) => Object.assign(_, {[name]: model}), {});

for(const [name, model] of Object.entries(models)) {
	model.associate?.(models);
}

export default {
	models,
	sequelize,
	Sequelize,
};
