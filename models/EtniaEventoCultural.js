// models/EtniaEventoCultural.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const EtniaEventoCultural = db.define(
	"etnia_evento_cultural",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		id_etnia: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		id_evento_cultural: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: "etnia_evento_cultural",
		timestamps: false,
	}
);

export default EtniaEventoCultural;
