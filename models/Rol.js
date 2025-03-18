import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de tener esta importación configurada correctamente

const Rol = db.define(
	"rol",
	{
		id_rol: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING(45),
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "rol",
		timestamps: false, // No necesitamos createdAt ni updatedAt
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_rol" }],
			},
		],
	}
);

export default Rol;
