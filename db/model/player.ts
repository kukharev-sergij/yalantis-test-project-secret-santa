import { Model, } from 'sequelize';
import { tableName as tableNameGame, } from './game';

export const schema = null;
export const modelName = 'Player';
export const tableName = 'player';
export { tableNameGame, };
export const nameLength = 100;
export const surnameLength = 100;
export function isName(value: String) {
	return typeof value === 'string';
}
export function isSurname(value: String) {
	return typeof value === 'string';
}

export default ({ aliases, sequelize, DataTypes, }) => {
	class Player extends Model {
		static associate({ aliases, models, }) {
			const { Game, } = models;
			Game.hasMany(Player, {
				as: aliases.Player.as,
				sourceKey: 'id',
				foreignKey: 'game_id',
			});
			Player.belongsTo(Game, {
				as: aliases.Game.as,
				foreignKey: 'game_id',
				targetKey: 'id',
			});
			Player.hasOne(Player, {
				as: aliases.Player.santa,
				sourceKey: 'id',
				foreignKey: 'santa_player_id',
			});
			Player.belongsTo(Player, {
				as: aliases.Player.as,
				foreignKey: 'santa_player_id',
				targetKey: 'id',
			});
		}
	};

	Player.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		gameId: {
			allowNull: false,
			field: 'game_id',
			references: {
				model: tableNameGame,
				key: 'id',
			},
			type: DataTypes.INTEGER,
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
			type: DataTypes.INTEGER,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING(nameLength),
			validate: { isName, },
		},
		surname: {
			allowNull: false,
			type: DataTypes.STRING(surnameLength),
			validate: { isSurname, },
		},
		createdAt: {
			allowNull: false,
			field: 'created_at',
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			field: 'updated_at',
			type: DataTypes.DATE,
		},
		deletedAt: {
			allowNull: true,
			field: 'deleted_at',
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName,
		timestamps: true,
		paranoid: true,
		underscored: true,
		freezeTableName: true,
		tableName,
		schema,
		initialAutoIncrement: '1',
	});

	return Player;
};