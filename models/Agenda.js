import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Agenda = db.define(
	"agenda",
	{
		id_agenda: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "evento",
				key: "id_evento",
			},
		},
		fecha: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "agenda",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_agenda" }],
			},
			{
				name: "fk_agenda_evento",
				using: "BTREE",
				fields: [{ name: "id_evento" }],
			},
		],
	}
);

export default Agenda;
