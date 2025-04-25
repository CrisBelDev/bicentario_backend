import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Notificacion = db.define(
	"notificacion",
	{
		id: {
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
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		mensaje: {
			type: DataTypes.TEXT,
			allowNull: false,
		},

		tipo: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: "evento",
		},
		leido: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		fecha_envio: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		id_evento: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "evento",
				key: "id_evento",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
	},
	{
		tableName: "notificacion",
		timestamps: false,
		indexes: [
			{
				name: "fk_notificacion_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
			{
				name: "fk_notificacion_evento",
				using: "BTREE",
				fields: [{ name: "id_evento" }],
			},
		],
	}
);

export default Notificacion;
