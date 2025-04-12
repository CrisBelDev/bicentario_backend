import { DataTypes } from "sequelize";
import db from "../config/db.js";

const EventoGastronomico = db.define(
	"evento_gastronomico",
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
		tipo_evento: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		platos_tipicos: {
			type: DataTypes.TEXT, // Puedes usar JSON.stringify para varios platos
			allowNull: true,
		},
		cocineros: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		lugar_preparacion: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		abierto_al_publico: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		costo_entrada: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
		},
	},
	{
		tableName: "evento_gastronomico",
		timestamps: false,
	}
);

export default EventoGastronomico;
