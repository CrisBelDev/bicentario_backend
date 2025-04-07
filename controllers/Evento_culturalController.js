import EventoCultural from "../models/Evento_cultural.js";

const EventoCulturalController = {
	async getAll(req, res) {
		try {
			const eventosCulturales = await EventoCultural.findAll();
			res.json(eventosCulturales);
		} catch (error) {
			res.status(500).json({ error: "Error al obtener eventos culturales" });
		}
	},

	async getById(req, res) {
		try {
			const { id } = req.params;
			console.log("recibi el id ", id);
			const eventoCultural = await EventoCultural.findAll({
				where: { id_evento: id }, // Filtramos por el id del evento
			});

			if (!eventoCultural || eventoCultural.length === 0) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}

			// Agregar URL completa a las imágenes
			const eventosConImagenes = eventoCultural.map((evento) => ({
				...evento.toJSON(), // Convertimos el objeto Sequelize en un objeto plano
				afiche_promocional: evento.afiche_promocional
					? `${req.protocol}://${req.get("host")}${evento.afiche_promocional}`
					: null, // Si no tiene afiche, asignamos null
			}));

			// Enviar la respuesta
			res.json(eventosConImagenes);
		} catch (error) {
			console.error("Error al obtener el evento cultural:", error);
			res.status(500).json({ error: "Error al obtener el evento cultural" });
		}
	},
	async getByIdPk(req, res) {
		try {
			const { id } = req.params;
			console.log("Recibí el id: ", id);

			// Cambiar a findOne para obtener solo un evento
			const eventoCultural = await EventoCultural.findOne({
				where: { id_evento_cultural: id }, // Filtramos por el id del evento
			});

			// Verificar si el evento cultural fue encontrado
			if (!eventoCultural) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}

			// Agregar URL completa a las imágenes
			const eventoConImagenes = {
				...eventoCultural.toJSON(), // Convertimos el objeto Sequelize en un objeto plano
				afiche_promocional: eventoCultural.afiche_promocional
					? `${req.protocol}://${req.get("host")}${
							eventoCultural.afiche_promocional
					  }`
					: null, // Si no tiene afiche, asignamos null
			};

			// Enviar la respuesta con el evento
			res.json({ evento: eventoConImagenes });
		} catch (error) {
			console.error("Error al obtener el evento cultural:", error);
			res.status(500).json({ error: "Error al obtener el evento cultural" });
		}
	},
	async create(req, res) {
		console.log("data===>", req.body);
		try {
			// Desestructurar los nuevos campos del cuerpo de la solicitud
			const {
				id_evento,
				descripcion,
				titulo,
				tipoEvento,
				fechaInicio,
				fechaFin,
				lugar,
				organizadoPor,
			} = req.body;

			// Obtener la URL de la imagen si existe
			const imagenes = req.file
				? `/uploads/evento_cultural/${req.file.filename}`
				: null;

			// Crear un nuevo evento cultural en la base de datos con los nuevos campos
			const nuevoEventoCultural = await EventoCultural.create({
				id_evento,
				descripcion,
				titulo, // Campo agregado
				tipo_evento: tipoEvento, // Campo agregado
				fecha_inicio: fechaInicio, // Campo agregado
				fecha_finalizacion: fechaFin, // Campo agregado
				lugar, // Campo agregado
				organizado_por: organizadoPor, // Campo agregado
				afiche_promocional: imagenes, // Campo agregado (opcional)
			});

			// Responder con el evento cultural recién creado
			res.status(201).json(nuevoEventoCultural);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Error al crear el evento cultural" });
		}
	},

	async update(req, res) {
		try {
			const { id } = req.params;
			const {
				id_evento_cultural,
				descripcion,
				titulo,
				tipo_evento,
				fecha_inicio,
				fecha_finalizacion,
				lugar,
				organizado_por,
			} = req.body;

			// Buscar el evento cultural por su id
			const eventoCultural = await EventoCultural.findByPk(id);
			if (!eventoCultural) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}

			// Si se sube un nuevo afiche, se maneja aquí
			let nuevaImagen = eventoCultural.afiche_promocional; // Por defecto, usamos la imagen anterior
			if (req.file) {
				// Si se sube una nueva imagen
				nuevaImagen = `/uploads/evento_cultural/${req.file.filename}`;
			}

			// Actualizar el evento cultural con los nuevos datos
			await eventoCultural.update({
				id_evento_cultural,
				titulo,
				descripcion,
				tipo_evento,
				fecha_inicio,
				fecha_finalizacion,
				lugar,
				organizado_por,
				afiche_promocional: nuevaImagen, // Se actualiza la imagen
			});

			// Responder con el evento actualizado
			res.json({
				mensaje: "Evento cultural actualizado correctamente",
				eventoCultural,
			});
		} catch (error) {
			console.error("Error al actualizar el evento cultural:", error);
			res.status(500).json({ error: "Error al actualizar el evento cultural" });
		}
	},
	async delete(req, res) {
		try {
			const { id } = req.params;
			const eventoCultural = await EventoCultural.findByPk(id);
			if (!eventoCultural) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}
			await eventoCultural.destroy();
			res.json({ message: "Evento cultural eliminado correctamente" });
		} catch (error) {
			res.status(500).json({ error: "Error al eliminar el evento cultural" });
		}
	},
};

// Función para manejar la subida de imágenes
export const subirImagenBlog = async (req, res) => {
	if (!req.file) {
		console.log("No se ha cargado ninguna imagen.");
		return res.status(400).json({ error: "No se ha cargado ninguna imagen." });
	}

	// Generar la URL de la imagen cargada con la ruta completa (incluyendo el protocolo y host)
	const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blog/${
		req.file.filename
	}`;
	console.log("ruta del la imagen del bloch: ", imageUrl);

	// Enviar la URL de la imagen en la respuesta
	res.json({ url: imageUrl });
};

export default EventoCulturalController;
