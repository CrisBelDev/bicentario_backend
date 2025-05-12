import Notificacion from "../models/Notificacion.js";
import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js"; // Asegúrate de importar el modelo de Usuario

// Controlador para crear una notificación para todos los usuarios con rol_id = 1
export const crearNotificacion = async (req, res) => {
	try {
		const { id_evento } = req.params;

		// Validación básica: Asegúrate de que el evento exista
		const evento = await Evento.findByPk(id_evento);
		if (!evento) {
			return res.status(404).json({ error: "Evento no encontrado." });
		}

		// Obtén todos los usuarios con rol_id = 1 (por ejemplo, administradores)
		const usuarios = await Usuario.findAll({
			where: { rol_id: 1 }, // Filtra usuarios por rol_id
		});

		// Si no hay usuarios con rol_id = 1
		if (usuarios.length === 0) {
			return res
				.status(404)
				.json({ error: "No se encontraron usuarios con el rol especificado." });
		}

		// Generar el mensaje con el título del evento
		const mensaje = `Ven y sé parte de "${evento.titulo}", ¡no te lo pierdas!`;

		// Crear una notificación para cada usuario
		const notificaciones = [];
		for (let usuario of usuarios) {
			const notificacion = await Notificacion.create({
				id_usuario: usuario.id_usuario,
				id_evento,
				mensaje,

				tipo: "evento", // Puedes ajustar esto si necesitas otros tipos
			});
			notificaciones.push(notificacion);
		}

		return res.status(201).json({
			message: "Notificaciones creadas con éxito.",
			notificaciones,
		});
	} catch (error) {
		console.error("Error al crear las notificaciones:", error);
		return res
			.status(500)
			.json({ error: "Error al crear las notificaciones." });
	}
};
export const crearNotificacionConID = async (id_evento) => {
	try {
		// Buscar el evento
		const evento = await Evento.findByPk(id_evento);
		if (!evento) throw new Error("Evento no encontrado");

		// Obtener usuarios con rol_id = 1 (administradores)
		const usuarios = await Usuario.findAll({
			where: { rol_id: 1 },
		});

		// Si no se encuentran usuarios con rol_id = 1
		if (usuarios.length === 0) {
			console.log("No se encontraron usuarios con rol_id = 1");
			return;
		}

		// Mensaje de la notificación
		const mensaje = `Ven y sé parte de "${evento.titulo}", ¡no te lo pierdas!`;

		// Crear una notificación para cada usuario
		const notificaciones = [];
		for (let usuario of usuarios) {
			const notificacion = await Notificacion.create({
				id_usuario: usuario.id_usuario,
				id_evento,
				mensaje,
				tipo: "evento",
			});
			notificaciones.push(notificacion);
		}

		console.log("Notificaciones creadas con éxito.", notificaciones);
	} catch (error) {
		console.error("Error al crear las notificaciones:", error);
	}
};
export const crearNotificacionesParaTodos = async () => {
	try {
		// Obtener todos los eventos
		const eventos = await Evento.findAll();
		if (eventos.length === 0) throw new Error("No hay eventos registrados");

		// Obtener todos los usuarios
		const usuarios = await Usuario.findAll();
		if (usuarios.length === 0) throw new Error("No hay usuarios registrados");

		const notificaciones = [];

		for (let evento of eventos) {
			const mensaje = `Ven y sé parte de "${evento.titulo}", ¡no te lo pierdas!`;

			for (let usuario of usuarios) {
				// Verificar si ya existe una notificación para ese usuario y evento
				const yaExiste = await Notificacion.findOne({
					where: {
						id_usuario: usuario.id_usuario,
						id_evento: evento.id_evento,
					},
				});

				if (!yaExiste) {
					const notificacion = await Notificacion.create({
						id_usuario: usuario.id_usuario,
						id_evento: evento.id_evento,
						mensaje,
						tipo: "evento",
					});
					notificaciones.push(notificacion);
				}
			}
		}

		console.log(
			"Notificaciones creadas exitosamente (sin duplicar).",
			notificaciones
		);
	} catch (error) {
		console.error("Error al crear notificaciones:", error);
	}
};

// Controlador para marcar una notificación como leída
export const marcarComoLeida = async (req, res) => {
	try {
		const { id } = req.params;

		// Busca la notificación por su ID
		const notificacion = await Notificacion.findByPk(id);
		if (!notificacion) {
			return res.status(404).json({ error: "Notificación no encontrada." });
		}

		// Marca la notificación como leída
		notificacion.leido = true;
		await notificacion.save();

		return res
			.status(200)
			.json({ message: "Notificación marcada como leída." });
	} catch (error) {
		console.error("Error al marcar la notificación como leída:", error);
		return res
			.status(500)
			.json({ error: "Error al marcar la notificación como leída." });
	}
};

// Controlador para obtener todas las notificaciones de un usuario
export const obtenerNotificacionesPorUsuario = async (req, res) => {
	try {
		const { id_usuario } = req.params;

		// Validación básica
		if (!id_usuario) {
			return res
				.status(400)
				.json({ error: "El ID del usuario es obligatorio." });
		}

		// Buscar notificaciones del usuario
		const notificaciones = await Notificacion.findAll({
			where: { id_usuario },
			include: [
				{
					model: Evento,
					as: "evento", // solo si definiste alias en la relación
					attributes: ["id_evento", "titulo", "fecha_inicio", "ubicacion"],
				},
			],
			order: [["fecha_envio", "DESC"]], // Ordenar por las más recientes
		});

		return res.status(200).json({ notificaciones });
	} catch (error) {
		console.error("Error al obtener notificaciones:", error);
		return res.status(500).json({
			error: "Error al obtener las notificaciones del usuario.",
		});
	}
};
