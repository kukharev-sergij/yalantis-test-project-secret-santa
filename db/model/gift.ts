import { Model, } from 'sequelize';
import { tableName as tableNamePlayer, } from './player';

export const schema = 'public';
export const modelName = 'gift';
export const tableName = modelName;
export { tableNamePlayer, };
export const nameLength = 100;
export function isName(value: String) {
	return typeof value === 'string';
}

export default ({ aliases, sequelize, DataTypes, }) => {
	class Gift extends Model {
		static associate({ aliases, models, }) {
			const { Player, } = models;
			Player.hasMany(Gift, {
				as: aliases.Gift.as,
				sourceKey: 'id',
				foreignKey: 'player_id',
			});
			Gift.belongsTo(Player, {
				as: aliases.Player.as,
				foreignKey: 'player_id',
				targetKey: 'id',
			});
		}
	};

	Gift.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
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
			type: DataTypes.INTEGER,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING(nameLength),
			validate: { isName, },
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

	return Gift;
};