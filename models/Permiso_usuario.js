import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const PermisoUsuario = db.define(
	"permiso_usuario",
	{
		id_permiso_usuario: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.UUID, // Asegúrate de que el tipo de `id_usuario` coincida con el tipo definido en el modelo 'usuario'
			allowNull: false,
			references: {
				model: "usuario", // Relación con el modelo 'usuario'
				key: "id_usuario",
			},
		},
		modulo: {
			type: DataTypes.ENUM("historia", "cultura", "evento", "agenda"),
			allowNull: false,
		},
		permiso: {
			type: DataTypes.ENUM("crear", "leer", "actualizar", "eliminar"),
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "permiso_usuario",
		timestamps: false, // No necesitas createdAt ni updatedAt
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_permiso_usuario" }],
			},
			{
				name: "fk_permiso_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default PermisoUsuario;
