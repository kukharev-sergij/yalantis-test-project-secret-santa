import sqlite3 from 'sqlite3';

/**
 * docs at https://sequelize.org/v7/manual/dialect-specific-things.html
 */
const cfg = {
	// host: 'localhost',
	// username: 'root',
	// password: 'root',
	// database: 'test-project',
	storage: 'db/db.sqlite',
	dialect: 'sqlite3',
	dialectOptions: {
		readWriteMode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_SHAREDCACHE,
	},
};

export default {
  development: { ...cfg, },
  test: { ...cfg, },
  production: { ...cfg, },
};
