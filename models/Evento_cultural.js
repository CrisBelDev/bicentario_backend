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
		titulo: {
			type: DataTypes.STRING,
			allowNull: false, // Campo obligatorio
		},
		tipo_evento: {
			type: DataTypes.STRING,
			allowNull: false, // Campo obligatorio
		},
		fecha_inicio: {
			type: DataTypes.DATE,
			allowNull: false, // Campo obligatorio
		},
		fecha_finalizacion: {
			type: DataTypes.DATE,
			allowNull: false, // Campo obligatorio
		},
		lugar: {
			type: DataTypes.STRING,
			allowNull: false, // Campo obligatorio
		},
		organizado_por: {
			type: DataTypes.STRING,
			allowNull: false, // Campo obligatorio
		},
		afiche_promocional: {
			type: DataTypes.STRING, // Podría ser la URL o el nombre del archivo
			allowNull: true, // Puede ser opcional
		},
	},
	{
		tableName: "evento_cultural",
		timestamps: false,
	}
);

export default EventoCultural;
