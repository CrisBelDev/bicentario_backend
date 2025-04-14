import { EventoAcademico, Evento } from "../models/index.js";

// Obtener un evento académico por ID
export const obtenerEventoAcademico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoAcademico = await EventoAcademico.findOne({
			where: { id_evento: id },
			include: {
				model: Evento,
				as: "evento",
			},
		});

		if (!eventoAcademico) {
			return res.status(404).json({ msg: "Evento académico no encontrado" });
		}

		res.json(eventoAcademico);
	} catch (error) {
		console.error("Error al obtener evento académico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};

// Crear un nuevo evento académico
export const crearEventoAcademico = async (req, res) => {
	console.log("Datos recibidos en evento academico es:", req.body);
	const datos = req.body;

	try {
		const nuevoEventoAcademico = await EventoAcademico.create(datos);
		res.status(201).json(nuevoEventoAcademico);
	} catch (error) {
		console.error("Error al crear evento académico:", error);
		res.status(500).json({ msg: "Error al registrar el evento académico" });
	}
};

// Actualizar un evento académico
export const actualizarEventoAcademico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoAcademico = await EventoAcademico.findOne({
			where: { id_evento: id },
		});

		if (!eventoAcademico) {
			return res.status(404).json({ msg: "Evento académico no encontrado" });
		}

		await eventoAcademico.update(req.body);
		res.json({
			msg: "Evento académico actualizado correctamente",
			eventoAcademico,
		});
	} catch (error) {
		console.error("Error al actualizar evento académico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};

// Eliminar un evento académico
export const eliminarEventoAcademico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoAcademico = await EventoAcademico.findOne({
			where: { id_evento: id },
		});

		if (!eventoAcademico) {
			return res.status(404).json({ msg: "Evento académico no encontrado" });
		}

		await eventoAcademico.destroy();
		res.json({ msg: "Evento académico eliminado correctamente" });
	} catch (error) {
		console.error("Error al eliminar evento académico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};
