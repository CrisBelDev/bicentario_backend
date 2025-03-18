import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js"; // Asegúrate de tener esta importación configurada correctamente

const TokenVerificacion = db.define(
	"tokens_verificacion",
	{
		id_token: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.UUID, // Usando UUID si tu 'usuario' tiene UUID como clave primaria
			allowNull: false,
			references: {
				model: "usuario", // Relación con el modelo 'usuario'
				key: "id_usuario", // Asegúrate que esta columna en 'usuario' sea de tipo UUID si usas UUID en 'usuario'
			},
		},
		token: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		expira: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "tokens_verificacion",
		timestamps: false, // No necesitas timestamps si no tienes createdAt y updatedAt
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_token" }],
			},
			{
				name: "fk_tokens_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default TokenVerificacion;
