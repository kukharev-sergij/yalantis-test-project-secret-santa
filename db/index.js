import fs from 'fs';
import { resolve, } from 'path';
import process from 'process';
import Sequelize from 'sequelize';
import configs from './config';

const { env, } = process;
const { DataTypes, } = Sequelize;
const mode = env.NODE_ENV ?? 'development';
const { database, username, password, ...config } = configs[mode];
const sequelize = new Sequelize(database, username, password, config);

const modelsRootPath = resolve(__dirname, 'model');
const aliases = {
	Game: {
		as: 'game',
	},
	Player: {
		as: 'player',
		santa: 'santa',
	},
	Gift: {
		as: 'gift',
	},
};
const models = fs.readdirSync(modelsRootPath)
  .filter(file => /^[^.~!].*?[.][jt]s$/.test(file))
  .map(file => {
		const filePath = resolve(modelsRootPath, file);
		const Model = require(filePath);
    const model = Model({ aliases, sequelize, DataTypes, });
		return [model.name, model];
  })
	.reduce((_, [name, model]) => Object.assign(_, {[name]: model}), {});

for (const model of Object.entries(models)) {
	const [name, instance] = model;
	instance?.associate?.({ aliases, models, });
}

export default {
	models,
	sequelize,
	Sequelize,
};
