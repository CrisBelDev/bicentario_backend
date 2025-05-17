import {
	Evento,
	Patrocinador,
	EventoCultural,
	EventoAcademico,
	EventoDeportivo,
	EventoGastronomico,
	Asistencia,
} from "../models/index.js";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";

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

//consulta para obtener todos los eventos que coincidan con el titulo de evento

export const obtenerEventosPorTitulo = async (req, res) => {
	try {
		const { titulo } = req.query; // Cambiar de req.params a req.query
		const { tipo } = req.query;

		// Inicializar las condiciones de búsqueda
		let whereConditions = {};

		// Si hay un título, agregar filtro por título
		if (titulo.trim()) {
			whereConditions.titulo = {
				[Op.like]: `%${titulo}%`,
			};
		}

		// Si se proporciona un tipo, agregar el filtro por tipo
		if (tipo) {
			whereConditions["$evento.tipo$"] = tipo; // Aseguramos que el filtro de tipo se aplique correctamente a los eventos.
		}

		// Buscar los eventos con las condiciones dinámicas
		const eventos = await Evento.findAll({
			where: whereConditions,
			include: [
				{ model: EventoCultural, as: "evento_cultural" },
				{ model: EventoAcademico, as: "evento_academico" },
				{ model: EventoDeportivo, as: "evento_deportivo" },
				{ model: EventoGastronomico, as: "evento_gastronomico" },
			],
		});

		if (eventos.length === 0) {
			return res.status(404).json({ message: "No se encontraron eventos" });
		}

		// Filtrar eventos por tipo adicionalmente, si es necesario
		const eventosFiltrados = tipo
			? eventos.filter((evento) => {
					if (tipo === "cultural" && evento.evento_cultural) return true;
					if (tipo === "academico" && evento.evento_academico) return true;
					if (tipo === "deportivo" && evento.evento_deportivo) return true;
					if (tipo === "gastronomico" && evento.evento_gastronomico)
						return true;
					return false;
			  })
			: eventos;

		const eventosConImagenes = eventosFiltrados.map((evento) => ({
			...evento.toJSON(),
			imagenes: evento.imagenes
				? `${req.protocol}://${req.get("host")}${evento.imagenes}`
				: null,
		}));

		return res.status(200).json({
			message: "Eventos encontrados",
			eventos: eventosConImagenes,
		});
	} catch (error) {
		console.error("Error al obtener los eventos:", error);
		return res
			.status(500)
			.json({ message: "Error interno del servidor consultas" });
	}
};

export const eventosPorTipo = async (req, res) => {
	try {
		const [cultural, deportivo, academico, gastronomico] = await Promise.all([
			EventoCultural.count(),
			EventoDeportivo.count(),
			EventoAcademico.count(),
			EventoGastronomico.count(),
		]);

		return res.status(200).json([
			{ tipo: "Cultural", cantidad: cultural },
			{ tipo: "Deportivo", cantidad: deportivo },
			{ tipo: "Académico", cantidad: academico },
			{ tipo: "Gastronómico", cantidad: gastronomico },
		]);
	} catch (error) {
		console.error("Error al obtener eventos por tipo:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

export const eventosPorMes = async (req, res) => {
	try {
		const resultados = await Evento.findAll({
			attributes: [
				[
					Sequelize.fn("DATE_FORMAT", Sequelize.col("fecha_inicio"), "%Y-%m"),
					"mes",
				],
				[Sequelize.fn("COUNT", Sequelize.col("*")), "total_eventos"],
			],
			group: ["mes"],
			order: [[Sequelize.literal("mes"), "ASC"]],
			raw: true,
		});

		res.json(resultados);
	} catch (error) {
		console.error("Error al obtener eventos por mes:", error);
		res.status(500).json({ error: "Error al obtener eventos por mes" });
	}
};

export const asistenciasPorEvento = async (req, res) => {
	try {
		const resultados = await Asistencia.findAll({
			attributes: [
				[Sequelize.col("asistencia.id_evento"), "id_evento"],
				[
					Sequelize.fn("COUNT", Sequelize.col("asistencia.id_evento")),
					"asistencias",
				],
			],
			include: [
				{
					model: Evento,
					as: "evento",
					attributes: ["id_evento", "titulo"],
				},
			],
			group: ["asistencia.id_evento", "evento.id_evento", "evento.titulo"],
		});

		res.json(resultados);
	} catch (error) {
		console.error("Error al obtener asistencias por evento:", error);
		res.status(500).json({ error: "Error al obtener asistencias por evento" });
	}
};
