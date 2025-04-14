import {
	Evento,
	Patrocinador,
	EventoCultural,
	EventoAcademico,
	EventoDeportivo,
	EventoGastronomico,
} from "../models/index.js";

export const obtenerEventoConDetalles = async (req, res) => {
	try {
		const { id } = req.params;

		const evento = await Evento.findByPk(id, {
			include: [
				{
					model: Patrocinador,
					through: { attributes: [] },
					attributes: ["id_patrocinador", "nombre"],
				},
				{ model: EventoCultural, as: "evento_cultural" },
				{ model: EventoAcademico, as: "evento_academico" },
				{ model: EventoDeportivo, as: "evento_deportivo" },
				{ model: EventoGastronomico, as: "evento_gastronomico" },
			],
		});

		if (!evento) {
			return res.status(404).json({ message: "Evento no encontrado" });
		}

		const eventoConImagen = {
			...evento.toJSON(),
			imagenes: evento.imagenes
				? `${req.protocol}://${req.get("host")}${evento.imagenes}`
				: null,
		};

		return res.status(200).json({
			message: "Evento encontrado",
			evento: eventoConImagen,
		});
	} catch (error) {
		console.error("Error al obtener el evento:", error);
		return res
			.status(500)
			.json({ message: "Error interno del servidor consultas" });
	}
};
