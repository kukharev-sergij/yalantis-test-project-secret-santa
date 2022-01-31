import fs from 'fs';
import { resolve, } from 'path';
import process from 'process';
import Sequelize from 'sequelize';
import * as configs from './config';

const { env, } = process;
const { DataTypes, } = Sequelize;
const mode = env.NODE_ENV ?? 'development';
const { database, username, password, ...config } = configs[mode];
const modelsRootPath = resolve(__dirname, 'model');

export { Sequelize, };
export const sequelize = new Sequelize(database, username, password, config);

export const aliases = {
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

export const models = fs.readdirSync(modelsRootPath)
  .filter(file => /^[^.~!].*?[.][jt]s$/.test(file))
  .map(file => {
		const filePath = resolve(modelsRootPath, file);
		const { default: Model, } = require(filePath);
    const model = Model({ aliases, sequelize, DataTypes, });
		return [model.name, model];
  })
	.reduce((_, [name, model]) => Object.assign(_, {[name]: model}), {});

for (const model of Object.entries(models)) {
	const [modelName, modelInstance] = model;
	modelInstance?.associate?.({ aliases, models, modelName, modelInstance });
}
