import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const PreferenciasUsuario = db.define(
	"preferencias_usuario",
	{
		id_preferencia: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.UUID, // Si tu modelo 'usuario' usa UUID como clave primaria, actualiza esto
			allowNull: false,
			references: {
				model: "usuario", // Relación con el modelo 'usuario'
				key: "id_usuario", // Verifica que el campo 'id_usuario' en el modelo 'usuario' tenga el tipo adecuado
			},
		},
		idioma: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		notificaciones: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
	},
	{
		sequelize: db,
		tableName: "preferencias_usuario",
		timestamps: false, // No necesitas createdAt ni updatedAt
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_preferencia" }],
			},
			{
				name: "fk_preferencias_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default PreferenciasUsuario;
