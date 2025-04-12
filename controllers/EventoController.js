import Evento from "../models/Evento.js";
import Patrocinador from "../models/Patrocinador.js";
import {
	crearRelacion,
	crearRelacion1,
} from "./EventosPatrocinadoresController.js";
//===============================================================
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// para la subida de arhivos
import { upload } from "../config/multerConfig.js";
import { Console } from "console";
export const crearEvento = async (req, res, next) => {
	console.log("Datos recibidos en el backend:", req.body);
	console.log("Archivo recibido:", req.file);

	let patrocinadores = [];

	if (req.body.patrocinadores) {
		try {
			patrocinadores = JSON.parse(req.body.patrocinadores);
			console.log(
				"IDs de patrocinadores:",
				patrocinadores.map((p) => p.value)
			);
		} catch (err) {
			console.error("Error al parsear patrocinadores:", err);
		}
	}

	// `id_usuario` ya está disponible en `req.usuario` gracias al middleware de verificación del token
	const id_usuario = req.usuario.id;

	try {
		const {
			titulo,
			descripcion,
			fecha_inicio,
			fecha_fin,
			ubicacion,
			tipo,
			lugar,
		} = req.body;

		// Validación de los campos obligatorios
		if (
			!titulo ||
			!descripcion ||
			!fecha_inicio ||
			!fecha_fin ||
			!ubicacion ||
			!tipo
		) {
			return res.status(400).json({
				message: "Todos los campos son obligatorios excepto imágenes.",
			});
		}

		// Obtener la URL de la imagen si existe
		const imagenes = req.file ? `/uploads/${req.file.filename}` : null;

		// Crear el evento en la base de datos
		const nuevoEvento = await Evento.create({
			id_usuario,
			titulo,
			descripcion,
			fecha_inicio,
			fecha_fin,
			ubicacion,
			imagenes, // Guardar la ruta de la imagen
			tipo,
			lugar,
		});
		console.log("evento creado: ", nuevoEvento.id_evento);

		// Crear relaciones con los patrocinadores si hay alguno
		if (patrocinadores.length > 0) {
			try {
				await crearRelacion1(
					nuevoEvento.id_evento,
					patrocinadores.map((p) => p.value)
				);
				console.log("Relación evento-patrocinadores creada");
			} catch (relErr) {
				console.error("Error al crear relación con patrocinadores:", relErr);
			}
		}
		return res
			.status(201)
			.json({ message: "Evento creado exitosamente", evento: nuevoEvento });
	} catch (error) {
		console.error("Error al crear el evento:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

export const mostrarEventos = async (req, res) => {
	try {
		console.log("----------------para la vista homepage-------------");
		const eventos = await Evento.findAll({
			order: [["fecha_inicio", "DESC"]],
		});

		if (eventos.length === 0) {
			return res.status(404).json({ message: "No hay eventos disponibles" });
		}

		// Agregar URL completa a las imágenes
		const eventosConImagenes = eventos.map((evento) => ({
			...evento.toJSON(),
			imagenes: evento.imagenes
				? `${req.protocol}://${req.get("host")}${evento.imagenes}`
				: null, // Si no tiene imagen, asignamos null
		}));

		return res.status(200).json({
			message: "Eventos encontrados",
			eventos: eventosConImagenes,
		});
	} catch (error) {
		console.error("Error al obtener los eventos:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

export const mostrarEventosPaginados = async (req, res) => {
	try {
		// Obtener los parámetros de la query: página (page) y límite (limit)
		const { page = 1, limit = 10 } = req.query;

		// Convertir los parámetros en números enteros
		const pageNumber = parseInt(page);
		const limitNumber = parseInt(limit);

		// Asegurarnos de que los números sean válidos
		if (pageNumber <= 0 || limitNumber <= 0) {
			return res
				.status(400)
				.json({ message: "Parámetros de paginación inválidos" });
		}
		console.log("eventos a mostrar en la pagina: ", pageNumber);
		// Obtener los eventos de la base de datos con paginación
		const eventos = await Evento.findAll({
			order: [["fecha_inicio", "DESC"]],
			offset: (pageNumber - 1) * limitNumber,
			limit: limitNumber,
			include: [
				{
					model: Patrocinador,
					through: { attributes: [] }, // evita mostrar la tabla intermedia
					attributes: ["id_patrocinador", "nombre"], // o los campos que desees
				},
			],
		});

		// Si no hay eventos
		if (eventos.length === 0) {
			return res.status(404).json({ message: "No hay eventos disponibles" });
		}

		// Obtener el total de eventos para calcular las páginas
		const totalEventos = await Evento.count();

		// Agregar URL completa a las imágenes
		const eventosConImagenes = eventos.map((evento) => ({
			...evento.toJSON(),
			imagenes: evento.imagenes
				? `${req.protocol}://${req.get("host")}${evento.imagenes}`
				: null, // Si no tiene imagen, asignamos null
		}));

		// Calcular el total de páginas
		const totalPages = Math.ceil(totalEventos / limitNumber);

		return res.status(200).json({
			message: "Eventos encontrados",
			eventos: eventosConImagenes,
			currentPage: pageNumber, // Página actual
			totalPages, // Total de páginas
		});
	} catch (error) {
		console.error("Error al obtener los eventos:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};
export const mostrarEventoPorId = async (req, res) => {
	try {
		// Obtener el ID del evento desde los parámetros de la ruta
		const { id } = req.params;

		// Buscar el evento en la base de datos por su ID
		const evento = await Evento.findByPk(id);

		// Si el evento no existe, devolver un error 404
		if (!evento) {
			return res.status(404).json({ message: "Evento no encontrado" });
		}

		// Agregar URL completa a las imágenes
		const eventoConImagenes = {
			...evento.toJSON(),
			imagenes: evento.imagenes
				? `${req.protocol}://${req.get("host")}${evento.imagenes}`
				: null, // Si no tiene imagen, asignamos null
		};
		console.log("datos enviando: ", eventoConImagenes);
		return res.status(200).json({
			message: "Evento encontrado",
			evento: eventoConImagenes,
		});
	} catch (error) {
		console.error("Error al obtener el evento:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

export const eliminarEvento = async (req, res) => {
	try {
		// Obtener el ID del evento desde los parámetros de la ruta
		const { id_evento } = req.params;

		// Buscar el evento en la base de datos por su ID
		const evento = await Evento.findByPk(id_evento);

		// Si el evento no existe, devolver un error 404
		if (!evento) {
			return res.status(404).json({ message: "Evento no encontrado" });
		}

		// Eliminar el evento
		await evento.destroy();

		return res.status(200).json({ message: "Evento eliminado con éxito" });
	} catch (error) {
		console.error("Error al eliminar el evento:", error);
		return res.status(500).json({ message: "Error interno del servidor" });
	}
};

export const editarEvento = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			titulo,
			descripcion,
			fecha_inicio,
			fecha_fin,
			ubicacion,
			tipo,
			lugar,
		} = req.body;

		// Buscar el evento
		const evento = await Evento.findByPk(id);
		if (!evento) {
			return res.status(404).json({ mensaje: "Evento no encontrado" });
		}

		// Imagen anterior guardada en la base de datos
		let imagenAnterior = evento.imagenes;
		let nuevaImagen = imagenAnterior; // por defecto conservar la misma imagen

		console.log("📷 Imagen anterior:", imagenAnterior);

		// Si se subió una nueva imagen
		if (req.file) {
			// Verificar que la imagen anterior no sea null antes de manipularla
			if (imagenAnterior) {
				const rutaImagenAnterior = path.join(
					".",
					imagenAnterior.replace(/^\/+/, "")
				);
				console.log(
					"🛣️ Ruta absoluta de la imagen anterior:",
					rutaImagenAnterior
				);

				if (fs.existsSync(rutaImagenAnterior)) {
					console.log("✅ Imagen anterior encontrada. Eliminando...");
					fs.unlinkSync(rutaImagenAnterior);
					console.log("🗑️ Imagen anterior eliminada");
				}
			}

			// Guardar nueva imagen
			nuevaImagen = `/uploads/${req.file.filename}`;
			console.log("🆕 Nueva imagen guardada:", nuevaImagen);
		}

		// Actualizar el evento con los datos y la nueva imagen (si se subió una)
		await evento.update({
			titulo,
			descripcion,
			fecha_inicio,
			fecha_fin,
			ubicacion,
			tipo,
			imagenes: nuevaImagen, // Aquí es donde se asigna la nueva imagen
			lugar,
		});

		return res.json({
			mensaje: "✅ Evento actualizado correctamente",
			evento,
		});
	} catch (error) {
		console.error("❌ Error al editar el evento:", error);
		return res.status(500).json({ mensaje: "Error del servidor" });
	}
};
