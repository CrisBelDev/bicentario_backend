import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Asegúrate de que esta importación esté correctamente configurada

const Patrocinador = db.define(
	"patrocinador",
	{
		id_patrocinador: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		descripcion: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "patrocinadores",
		timestamps: true, // Pon false si no necesitas createdAt y updatedAt
	}
);

export default Patrocinador;
