import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada
import EventoAcademico from "./Evento_academico.js"; // Asegúrate de importar correctamente

const Evento = db.define(
	"evento",
	{
		id_evento: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.UUID, // Cambiado a UUID para coincidir con el modelo Usuario
			allowNull: false,
			references: {
				model: "usuario",
				key: "id_usuario",
			},
		},
		titulo: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		fecha_inicio: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		fecha_fin: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		lugar: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},

		ubicacion: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		imagenes: {
			type: DataTypes.TEXT, // Puede almacenar URLs o JSON con múltiples imágenes
			allowNull: true, // Puede ser NULL
		},
		tipo: {
			type: DataTypes.STRING(45), // VARCHAR(45)
			allowNull: false,
		},
	},
	{
		tableName: "evento",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_evento" }],
			},
			{
				name: "fk_evento_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default Evento;
