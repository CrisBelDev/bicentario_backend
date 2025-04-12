import { EventoGastronomico, Evento } from "../models/index.js";

// Obtener un evento gastronómico por ID
export const obtenerEventoGastronomico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoGastronomico = await EventoGastronomico.findOne({
			where: { id_evento: id },
			include: {
				model: Evento,
				as: "evento",
			},
		});

		if (!eventoGastronomico) {
			return res.status(404).json({ msg: "Evento gastronómico no encontrado" });
		}

		res.json(eventoGastronomico);
	} catch (error) {
		console.error("Error al obtener evento gastronómico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};

// Crear un nuevo evento gastronómico
export const crearEventoGastronomico = async (req, res) => {
	const datos = req.body;

	try {
		const nuevoEventoGastronomico = await EventoGastronomico.create(datos);
		res.status(201).json(nuevoEventoGastronomico);
	} catch (error) {
		console.error("Error al crear evento gastronómico:", error);
		res.status(500).json({ msg: "Error al registrar el evento gastronómico" });
	}
};

// Actualizar evento gastronómico
export const actualizarEventoGastronomico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoGastronomico = await EventoGastronomico.findOne({
			where: { id_evento: id },
		});

		if (!eventoGastronomico) {
			return res.status(404).json({ msg: "Evento gastronómico no encontrado" });
		}

		await eventoGastronomico.update(req.body);
		res.json({
			msg: "Evento gastronómico actualizado correctamente",
			eventoGastronomico,
		});
	} catch (error) {
		console.error("Error al actualizar evento gastronómico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};

// Eliminar evento gastronómico
export const eliminarEventoGastronomico = async (req, res) => {
	const { id } = req.params;

	try {
		const eventoGastronomico = await EventoGastronomico.findOne({
			where: { id_evento: id },
		});

		if (!eventoGastronomico) {
			return res.status(404).json({ msg: "Evento gastronómico no encontrado" });
		}

		await eventoGastronomico.destroy();
		res.json({ msg: "Evento gastronómico eliminado correctamente" });
	} catch (error) {
		console.error("Error al eliminar evento gastronómico:", error);
		res.status(500).json({ msg: "Error del servidor" });
	}
};
