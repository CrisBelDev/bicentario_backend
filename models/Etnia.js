import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Etnia = db.define(
	"etnia",
	{
		id_etnia: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		origen: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ubicacion: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		idioma: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		costumbres: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		vestimenta: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		imagen: {
			type: DataTypes.STRING(255), // URL de la imagen
			allowNull: true,
		},
	},
	{
		tableName: "etnia",
		timestamps: false,
	}
);

export default Etnia;
