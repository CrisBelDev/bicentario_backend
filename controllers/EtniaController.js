// controllers/EtniaController.js
import Etnia from "../models/Etnia.js";
import EventoCultural from "../models/Evento_cultural.js";
import EtniaEventoCultural from "../models/EtniaEventoCultural.js";

// Crear una nueva etnia
export const createEtnia = async (req, res) => {
	try {
		const { nombre, origen, ubicacion, idioma, costumbres, vestimenta } =
			req.body;

		const nuevaEtnia = await Etnia.create({
			nombre,
			origen,
			ubicacion,
			idioma,
			costumbres,
			vestimenta,
		});

		res.status(201).json({ mensaje: "Etnia creada exitosamente", nuevaEtnia });
	} catch (error) {
		console.error("Error al crear la etnia:", error);
		res.status(500).json({ error: "Error al crear la etnia" });
	}
};

// Obtener todas las etnias
export const getAllEtnias = async (req, res) => {
	try {
		const etnias = await Etnia.findAll();
		res.json(etnias);
	} catch (error) {
		console.error("Error al obtener etnias:", error);
		res.status(500).json({ error: "Error al obtener etnias" });
	}
};

// Obtener una etnia por su id
export const getEtniaById = async (req, res) => {
	try {
		const { id } = req.params;
		const etnia = await Etnia.findByPk(id);

		if (!etnia) {
			return res.status(404).json({ error: "Etnia no encontrada" });
		}

		res.json({ etnia });
	} catch (error) {
		console.error("Error al obtener la etnia:", error);
		res.status(500).json({ error: "Error al obtener la etnia" });
	}
};

// Asociar una etnia a un evento cultural
export const associateEtniaToEventoCultural = async (req, res) => {
	try {
		const { id_etnia, id_evento_cultural } = req.body;

		// Verificar si la etnia y el evento cultural existen
		const etnia = await Etnia.findByPk(id_etnia);
		const eventoCultural = await EventoCultural.findByPk(id_evento_cultural);
		console.log(eventoCultural);
		if (!etnia || !eventoCultural) {
			return res
				.status(404)
				.json({ error: "Etnia o evento cultural no encontrado" });
		}

		// Crear la relación en la tabla intermedia
		const nuevaRelacion = await EtniaEventoCultural.create({
			id_etnia,
			id_evento_cultural,
		});

		res.status(201).json({
			mensaje: "Etnia asociada al evento cultural exitosamente",
			nuevaRelacion,
		});
	} catch (error) {
		console.error("Error al asociar la etnia al evento cultural:", error);
		res
			.status(500)
			.json({ error: "Error al asociar la etnia al evento cultural" });
	}
};

// Obtener los eventos culturales asociados a una etnia
export const getEventosCulturalesByEtnia = async (req, res) => {
	try {
		const { id } = req.params;

		// Buscar la etnia por id
		const etnia = await Etnia.findByPk(id);

		if (!etnia) {
			return res.status(404).json({ error: "Etnia no encontrada" });
		}

		// Obtener los eventos culturales asociados a la etnia
		const eventosCulturales = await etnia.getEventoCulturales();

		res.json({ eventosCulturales });
	} catch (error) {
		console.error(
			"Error al obtener los eventos culturales de la etnia:",
			error
		);
		res
			.status(500)
			.json({ error: "Error al obtener los eventos culturales de la etnia" });
	}
};

// Obtener las etnias asociadas a un evento cultural
export const getEtniasByEventoCultural = async (req, res) => {
	try {
		const { id } = req.params;

		// Buscar el evento cultural por id
		const eventoCultural = await EventoCultural.findByPk(id);

		if (!eventoCultural) {
			return res.status(404).json({ error: "Evento cultural no encontrado" });
		}

		// Obtener las etnias asociadas al evento cultural
		const etnias = await eventoCultural.getEtnias();

		res.json({ etnias });
	} catch (error) {
		console.error("Error al obtener las etnias del evento cultural:", error);
		res
			.status(500)
			.json({ error: "Error al obtener las etnias del evento cultural" });
	}
};
