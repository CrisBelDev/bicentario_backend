import EventosPatrocinadores from "../models/EventosPatrocinadores.js";
import { Evento, Patrocinador } from "../models/index.js";

export const obtenerEventosConPatrocinadores = async (req, res) => {
	try {
		const eventos = await Evento.findAll({
			include: {
				model: Patrocinador,
				through: {
					attributes: [], // Esto oculta la tabla intermedia
				},
			},
		});

		return res.status(200).json({
			mensaje: "Eventos con patrocinadores obtenidos con éxito",
			data: eventos,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			mensaje: "Hubo un error al obtener los eventos con patrocinadores",
			error: error.message,
		});
	}
};

// Crear una relación entre un evento y un patrocinador
export const crearRelacion = async (req, res) => {
	const { id_evento, id_patrocinador } = req.body;

	try {
		// Crear la relación en la base de datos
		const nuevaRelacion = await EventosPatrocinadores.create({
			id_evento,
			id_patrocinador,
		});

		return res.status(201).json({
			mensaje: "Relación creada con éxito",
			data: nuevaRelacion,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			mensaje: "Hubo un error al crear la relación",
			duplicado: true,
			error: error.message,
		});
	}
};

// Obtener todas las relaciones entre eventos y patrocinadores
export const obtenerRelaciones = async (req, res) => {
	try {
		const relaciones = await EventosPatrocinadores.findAll();
		return res.status(200).json({
			mensaje: "Relaciones obtenidas con éxito",
			data: relaciones,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			mensaje: "Hubo un error al obtener las relaciones",
			error: error.message,
		});
	}
};

// Eliminar una relación entre un evento y un patrocinador
export const eliminarRelacion = async (req, res) => {
	const { id_evento, id_patrocinador } = req.params;

	try {
		// Buscar la relación
		const relacion = await EventosPatrocinadores.findOne({
			where: {
				id_evento,
				id_patrocinador,
			},
		});

		if (!relacion) {
			return res.status(404).json({
				mensaje: "Relación no encontrada",
			});
		}

		// Eliminar la relación
		await relacion.destroy();

		return res.status(200).json({
			mensaje: "Relación eliminada con éxito",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			mensaje: "Hubo un error al eliminar la relación",
			error: error.message,
		});
	}
};
