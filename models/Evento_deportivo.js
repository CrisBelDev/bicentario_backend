import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Evento from "./Evento.js"; // Asegúrate de que la ruta esté correcta

const EventoDeportivo = db.define(
	"evento_deportivo",
	{
		id_evento: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: "evento",
				key: "id_evento",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		disciplina: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		categorias: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		modalidad: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		reglas: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		premios: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		equipos_participantes: {
			type: DataTypes.TEXT, // JSON stringificado
			allowNull: true,
		},
		organizado_por: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		requisitos_participacion: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "evento_deportivo",
		timestamps: false,
	}
);

export default EventoDeportivo;
