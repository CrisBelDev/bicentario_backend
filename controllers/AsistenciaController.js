// controllers/AsistenciaController.js
import Asistencia from "../models/Asistencia.js";
import moment from "moment-timezone";
export const registrarAsistencia = async (req, res) => {
	console.log("Datos recibidos:", req.body); // Agregado para depuración
	try {
		const { id_evento, id_usuario } = req.body;

		const timestamp =
			req.body.timestamp || moment().tz("America/La_Paz").format();

		if (!id_evento || !id_usuario) {
			return res.status(400).json({ mensaje: "Faltan datos requeridos." });
		}

		// ⚠️ Asegúrate de usar las claves correctas que coincidan con el modelo
		const [asistencia, creada] = await Asistencia.findOrCreate({
			where: {
				id_evento: id_evento,
				id_usuario: id_usuario,
			},
			defaults: {
				timestamp: timestamp,
			},
		});

		if (!creada) {
			return res
				.status(200)
				.json({ mensaje: "Ya se registró la asistencia previamente." });
		}

		return res
			.status(201)
			.json({ mensaje: "Asistencia registrada exitosamente." });
	} catch (error) {
		console.error("Error al registrar asistencia:", error);
		return res.status(500).json({ mensaje: "Error interno del servidor." });
	}
};
