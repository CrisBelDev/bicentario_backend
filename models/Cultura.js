import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Cultura = db.define(
	"cultura",
	{
		id_cultura: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		tipo: {
			type: DataTypes.ENUM("etnia"),
			allowNull: false,
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		id_usuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "usuario",
				key: "id_usuario",
			},
		},
	},
	{
		sequelize: db,
		tableName: "cultura",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_cultura" }],
			},
			{
				name: "fk_cultura_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default Cultura;
