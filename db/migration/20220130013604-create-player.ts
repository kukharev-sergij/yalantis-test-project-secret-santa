import {
  tableName,
  tableNameGame,
  nameLength,
  surnameLength,
  isName,
  isSurname,
} from '../model/player';

export async function up(queryInterface, Sequelize) {
	await queryInterface.createTable(tableName, {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		gameId: {
			allowNull: false,
			field: 'game_id',
			references: {
				model: tableNameGame,
				key: 'id',
			},
			type: Sequelize.INTEGER,
		},
		santaPlayerId: {
			allowNull: true,
			field: 'santa_player_id',
			references: {
				model: tableName,
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
		surname: {
			allowNull: false,
			type: Sequelize.STRING(surnameLength),
			validate: { isSurname, },
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
