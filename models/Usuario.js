import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
	"usuario",
	{
		id_usuario: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4, // Usamos UUID como identificador único
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		apellido: {
			type: DataTypes.STRING(100),
			allowNull: true, // Opcional
		},
		correo: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true, // Validación para asegurar que sea un correo válido
			},
		},
		telefono: {
			type: DataTypes.STRING(20),
			allowNull: true, // Opcional
			validate: {
				isNumeric: true,
				len: [8, 15], // Longitud mínima y máxima
			},
		},
		estado: {
			type: DataTypes.ENUM("pendiente", "confirmado", "bloqueado"),
			allowNull: false,
			defaultValue: "pendiente",
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate: {
				len: [8, 100], // Longitud mínima
			},
		},
		rol_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1, // Establece el valor por defecto a 1
			references: {
				model: "rol", // Asegúrate de tener este modelo creado
				key: "id_rol",
			},
		},
		id_ciudad: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "ciudad", // Asegúrate de tener este modelo creado
				key: "id_ciudad",
			},
		},
		genero: {
			type: DataTypes.ENUM("masculino", "femenino", "otro"),
			allowNull: true, // Opcional
		},
	},
	{
		hooks: {
			// Hook para cifrar la contraseña antes de guardar el usuario
			beforeCreate: async (usuario) => {
				const salt = await bcrypt.genSalt(10);
				usuario.password = await bcrypt.hash(usuario.password, salt);
			},
		},
		tableName: "usuario",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id_usuario" }],
			},
			{
				name: "correo",
				unique: true,
				using: "BTREE",
				fields: [{ name: "correo" }],
			},
			{
				name: "fk_usuario_rol",
				using: "BTREE",
				fields: [{ name: "rol_id" }],
			},
			{
				name: "fk_usuario_ciudad",
				using: "BTREE",
				fields: [{ name: "id_ciudad" }],
			},
		],
	}
);

export default Usuario;
