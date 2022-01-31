import { Model, } from 'sequelize';

export const schema = null;
export const modelName = 'Game';
export const tableName = 'game';
export interface GameSettings {
	giftsMaxAmount?: number;
	giftsMinAmount?: number;
	usersMaxAmount?: number;
	usersMinAmount?: number;
};
export function areSettings(value: GameSettings) {
	return value instanceof Object;
}

export default ({ aliases, sequelize, DataTypes, }) => {
	class Game extends Model {
		static associate({ aliases, models, }) {
		}
	};

	Game.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		active: {
			allowNull: false,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
		settings: {
			allowNull: false,
			defaultValue: {},
			type: DataTypes.JSON,
			validate: { areSettings, },
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

	return Game;
};