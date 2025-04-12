import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Evento from "../models/Evento.js"; // Asegúrate de que la ruta sea correcta
const EventoAcademico = db.define(
	"evento_academico",
	{
		id_evento: {
			type: DataTypes.INTEGER,
			primaryKey: true, // Ahora es la clave primaria
			allowNull: false,
			references: {
				model: "evento", // Asegúrate de que esté definido el modelo Evento
				key: "id_evento",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		tipo_evento: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		modalidad: {
			type: DataTypes.ENUM("virtual", "presencial", "mixto"),
			allowNull: false,
			defaultValue: "virtual",
		},
		organizado_por: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		ponentes: {
			type: DataTypes.TEXT, // Puede ser un JSON stringificado
			allowNull: true,
		},
		enlace_sesion: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		es_gratuito: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		requisitos_registro: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "evento_academico",
		timestamps: false,
	}
);
export default EventoAcademico;
