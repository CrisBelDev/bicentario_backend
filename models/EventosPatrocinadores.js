import { DataTypes } from "sequelize";
import db from "../config/db.js";

const EventosPatrocinadores = db.define(
	"eventos_patrocinadores",
	{
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "evento", // Asegúrate de que el nombre del modelo de eventos esté correcto
				key: "id_evento", // La clave primaria en la tabla de eventos
			},
			onDelete: "CASCADE", // Al eliminar el evento, se eliminarán las relaciones correspondientes
			onUpdate: "CASCADE", // Actualiza las relaciones si se cambia la clave foránea
		},
		id_patrocinador: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "patrocinadores", // Asegúrate de que el nombre del modelo de patrocinadores esté correcto
				key: "id_patrocinador", // La clave primaria en la tabla de patrocinadores
			},
			onDelete: "CASCADE", // Esto elimina la relación si se elimina el patrocinador
			onUpdate: "CASCADE", // Actualiza la relación si se cambia la clave foránea
		},
	},
	{
		tableName: "eventos_patrocinadores", // Nombre de la tabla en la base de datos
		timestamps: false, // No necesitamos createdAt y updatedAt en una tabla intermedia
		primaryKey: false, // No necesitamos una clave primaria compuesta si solo estamos usando las claves foráneas
	}
);

export default EventosPatrocinadores;
