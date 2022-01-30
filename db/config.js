import sqlite3 from 'sqlite3';
import sqlite from 'sqlite';
import { resolve, } from 'path';

/**
 * docs at https://sequelize.org/v7/manual/dialect-specific-things.html
 */
const cfg = {
	host: 'localhost',
	username: 'root',
	password: 'root',
	database: 'test-project',
	storage: resolve(__dirname, 'db.sqlite'), // ':memory:',
	dialect: 'sqlite',
	dialectOptions: {
		readWriteMode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_SHAREDCACHE,
	},
};

const development = { ...cfg, };
const test = { ...cfg, };
const production = { ...cfg, };


export {
  development,
  test,
  production,
};
