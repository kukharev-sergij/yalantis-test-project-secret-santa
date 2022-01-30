import {
  tableName,
  tableNamePlayer,
  nameLength,
  isName,
} from '../model/gift';

export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable(tableName, {
    id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		playerId: {
			allowNull: true,
			field: 'player_id',
			references: {
				model: tableNamePlayer,
				key: 'id',
			},
			onDelete: 'RESTRICT',
			onUpdate: 'CASCADE',
			type: Sequelize.INTEGER,
		},
		name: {
			allowNull: false,
			type: Sequelize.STRING(nameLength),
			validate: { isName, },
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
