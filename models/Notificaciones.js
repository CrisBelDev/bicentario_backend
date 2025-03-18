import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Notificaciones = db.define(
	"notificaciones",
	{
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		id_usuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "usuario",
				key: "id_usuario",
			},
		},
		tipo: {
			type: DataTypes.ENUM("evento", "noticia", "recordatorio"),
			allowNull: false,
		},
		mensaje: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		fecha_envio: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "notificaciones",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id" }],
			},
			{
				name: "fk_notificaciones_usuario",
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
		],
	}
);

export default Notificaciones;
