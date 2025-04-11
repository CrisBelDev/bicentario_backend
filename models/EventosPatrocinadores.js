import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const EventosPatrocinadores = db.define(
	"eventos_patrocinadores",
	{
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, // Clave primaria
			references: {
				model: "evento", // Asegúrate de que el nombre del modelo de eventos esté correcto
				key: "id_evento", // La clave primaria en la tabla de eventos
			},
		},
		id_patrocinador: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true, // Clave primaria
			references: {
				model: "patrocinadores", // Asegúrate de que el nombre del modelo de patrocinadores esté correcto
				key: "id_patrocinador", // La clave primaria en la tabla de patrocinadores
			},
		},
	},
	{
		tableName: "eventos_patrocinadores", // Nombre de la tabla en la base de datos
		timestamps: false, // No necesitamos createdAt y updatedAt en una tabla intermedia
	}
);

export default EventosPatrocinadores;
