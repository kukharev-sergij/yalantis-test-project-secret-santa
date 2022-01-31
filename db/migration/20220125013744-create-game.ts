import {
	tableName,
	areSettings,
} from '../model/game';

export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable(tableName, {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		active: {
			allowNull: false,
			defaultValue: false,
			type: Sequelize.BOOLEAN,
		},
		settings: {
			allowNull: false,
			defaultValue: {},
			type: Sequelize.JSON,
			validate: { areSettings, },
		},
		createdAt: {
			allowNull: false,
			field: 'created_at',
			type: Sequelize.DATE,
		},
		updatedAt: {
			allowNull: false,
			field: 'updated_at',
			type: Sequelize.DATE,
		},
		deletedAt: {
			allowNull: true,
			field: 'deleted_at',
			type: Sequelize.DATE,
		},
	});
};

export async function down(queryInterface, Sequelize) {
	await queryInterface.dropTable(tableName);
};
