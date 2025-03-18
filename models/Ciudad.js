import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Ciudad = db.define(
	"ciudad",
	{
		id_ciudad: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_pais: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "pais",
				key: "id_pais",
			},
		},
		nombre: {
			type: DataTypes.STRING(45),
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "ciudad",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_ciudad" }],
			},
			{
				name: "fk_ciudad_pais",
				using: "BTREE",
				fields: [{ name: "id_pais" }],
			},
		],
	}
);

export default Ciudad;
