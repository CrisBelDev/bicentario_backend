import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Pais = db.define(
	"pais",
	{
		id_pais: {
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
		tableName: "pais",
		timestamps: false, // No se necesita createdAt ni updatedAt
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_pais" }],
			},
		],
	}
);

export default Pais;
