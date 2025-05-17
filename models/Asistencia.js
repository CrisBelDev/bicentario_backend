// models/Asistencia.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Usuario from "./Usuario.js";
import Evento from "./Evento.js";

const Asistencia = db.define(
	"asistencia",
	{
		id_asistencia: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "usuario",
				key: "id_usuario",
			},
		},
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "evento",
				key: "id_evento",
			},
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "asistencia",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: ["id_asistencia"],
			},
			{
				name: "unique_usuario_evento",
				unique: true,
				using: "BTREE",
				fields: ["id_usuario", "id_evento"],
			},
		],
	}
);

// Relaciones (opcional pero útil)
Usuario.belongsToMany(Evento, {
	through: Asistencia,
	foreignKey: "id_usuario",
	otherKey: "id_evento",
});

Evento.belongsToMany(Usuario, {
	through: Asistencia,
	foreignKey: "id_evento",
	otherKey: "id_usuario",
});

export default Asistencia;
