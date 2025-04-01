import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Evento from "./Evento.js"; // Importamos el modelo Evento

const EventoCultural = db.define(
	"evento_cultural",
	{
		id_evento_cultural: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Evento,
				key: "id_evento",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "evento_cultural",
		timestamps: false,
	}
);

export default EventoCultural;
