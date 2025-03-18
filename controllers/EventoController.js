import Evento from "../models/Evento.js";
import jwt from "jsonwebtoken";
// para la subida de arhivos
import upload from "../config/multerConfig.js";
export const crearEvento = async (req, res) => {
	console.log("Datos recibidos en el backend:", req.body);
	console.log("Archivo recibido:", req.file);

	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ message: "No se proporcionó el token" });
	}

	const token = authHeader.split(" ")[1];

	let id_usuario;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		id_usuario = decoded.id;
	} catch (error) {
		console.error("Error al verificar token:", error.message);
		return res.status(401).json({ message: "Token inválido o expirado" });
	}

	try {
		const { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, tipo } =
			req.body;

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

		// Obtener URL de la imagen
		const imagenes = req.file ? `/uploads/${req.file.filename}` : null;

		const nuevoEvento = await Evento.create({
			id_usuario,
			titulo,
			descripcion,
			fecha_inicio,
			fecha_fin,
			ubicacion,
			imagenes, // Guarda la ruta de la imagen
			tipo,
		});

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
		const eventos = await Evento.findAll({
			order: [["fecha_inicio", "ASC"]],
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
