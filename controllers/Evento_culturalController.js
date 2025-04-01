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
			const eventoCultural = await EventoCultural.findByPk(id);
			if (!eventoCultural) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}
			res.json(eventoCultural);
		} catch (error) {
			res.status(500).json({ error: "Error al obtener el evento cultural" });
		}
	},

	async create(req, res) {
		try {
			const { id_evento, descripcion } = req.body;
			const nuevoEventoCultural = await EventoCultural.create({
				id_evento,
				descripcion,
			});
			res.status(201).json(nuevoEventoCultural);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Error al crear el evento cultural" });
		}
	},

	async update(req, res) {
		try {
			const { id } = req.params;
			const { id_evento, descripcion } = req.body;
			const eventoCultural = await EventoCultural.findByPk(id);
			if (!eventoCultural) {
				return res.status(404).json({ error: "Evento cultural no encontrado" });
			}
			await eventoCultural.update({ id_evento, descripcion });
			res.json(eventoCultural);
		} catch (error) {
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
