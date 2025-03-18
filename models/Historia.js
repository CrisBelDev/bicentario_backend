import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Historia = db.define(
	"historia",
	{
		id_historia: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		tipo: {
			type: DataTypes.ENUM("batalla", "independencia", "personaje"),
			allowNull: false,
		},
		titulo: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		fecha: {
			type: DataTypes.DATEONLY,
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
		tableName: "historia",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_historia" }],
			},
			{
				name: "fk_historia_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default Historia;
