import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
	"Usuario",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		apellido: {
			type: DataTypes.STRING,
			allowNull: true, // Opcional
		},
		correo: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		telefono: {
			type: DataTypes.STRING,
			allowNull: true, // Opcional
			validate: {
				isNumeric: true,
				len: [8, 15], // Longitud mínima y máxima
			},
		},
		pais: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ciudad: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		genero: {
			type: DataTypes.ENUM("masculino", "femenino", "otro"),
			allowNull: true, // Opcional
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [8, 100], // Longitud mínima
			},
		},
		verificado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false, // Se activará tras la verificación
		},
		token_verificacion: {
			type: DataTypes.STRING,
			allowNull: true, // Se usará para verificar la cuenta por correo/SMS
		},
	},
	{
		hooks: {
			beforeCreate: async (usuario) => {
				const salt = await bcrypt.genSalt(10);
				usuario.password = await bcrypt.hash(usuario.password, salt);
			},
		},
	}
);

export default Usuario;
